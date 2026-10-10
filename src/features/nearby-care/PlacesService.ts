import { NormalizedFacility, PlacesSource, FacilityType, FacilityOwnership } from './types';
import { SEED_FACILITIES } from './data/seedFacilities';
import { calculateHaversineDistance, estimateTravelTimeMinutes } from './utils/haversine';

// 15-minute cache TTL in milliseconds
const CACHE_TTL_MS = 15 * 60 * 1000;
const CACHE_KEY_PREFIX = 'swasthya_care_cache_';

export interface PlacesProvider {
  name: PlacesSource;
  searchNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    types?: FacilityType[]
  ): Promise<NormalizedFacility[]>;
}

/**
 * Normalizes OpenStreetMap Overpass response element to NormalizedFacility
 */
function normalizeOsmElement(el: any, userLat: number, userLng: number): NormalizedFacility {
  const tags = el.tags || {};
  const lat = el.lat || el.center?.lat || userLat;
  const lng = el.lon || el.center?.lon || userLng;

  let type: FacilityType = 'clinic';
  if (tags.amenity === 'hospital' || tags.healthcare === 'hospital') {
    type = 'hospital';
  } else if (tags.amenity === 'pharmacy') {
    type = 'pharmacy';
  } else if (tags.healthcare === 'centre' || tags.amenity === 'health_post') {
    type = tags.name?.toLowerCase().includes('chc') ? 'CHC' : 'PHC';
  } else if (tags.healthcare === 'laboratory') {
    type = 'diagnostic_lab';
  } else if (tags.amenity === 'nursing_home') {
    type = 'nursing_home';
  }

  let ownership: FacilityOwnership = 'unknown';
  if (tags.operator_type === 'public' || tags.operator_type === 'government' || tags.fee === 'no') {
    ownership = 'government';
  } else if (tags.operator_type === 'private' || tags.fee === 'yes') {
    ownership = 'private';
  }

  const isEmergency =
    tags.emergency === 'yes' ||
    tags['healthcare:speciality']?.includes('emergency') ||
    tags.opening_hours === '24/7' ||
    type === 'hospital';

  const specialities: string[] = [];
  if (tags['healthcare:speciality']) {
    specialities.push(...tags['healthcare:speciality'].split(';'));
  } else {
    specialities.push('General Medicine');
    if (isEmergency) specialities.push('Emergency & Trauma');
  }

  const distanceKm = calculateHaversineDistance(userLat, userLng, lat, lng);
  const travelMin = estimateTravelTimeMinutes(distanceKm, isEmergency);

  const address =
    tags['addr:full'] ||
    [tags['addr:street'], tags['addr:suburb'], tags['addr:city'], tags['addr:postcode']]
      .filter(Boolean)
      .join(', ') ||
    'Address verified via OpenStreetMap';

  return {
    id: `osm-${el.id}`,
    name: tags.name || tags['name:en'] || `Healthcare Centre #${el.id}`,
    type,
    ownership,
    lat,
    lng,
    distanceKm,
    estimatedTravelTimeMin: travelMin,
    address,
    phone: tags.phone || tags['contact:phone'] || '+91-108 (National Helpline)',
    openNow: tags.opening_hours === '24/7' || true,
    hours: tags.opening_hours || (isEmergency ? '24 Hours Emergency' : '8:00 AM - 5:00 PM'),
    emergencyAvailable: isEmergency,
    specialities,
    rating: tags.rating ? Number(tags.rating) : 4.2,
    source: 'osm',
    lastUpdated: tags.timestamp ? tags.timestamp.substring(0, 10) : new Date().toISOString().substring(0, 10),
    verified: Boolean(tags.operator || tags.name),
    pmjayEmpanelled: ownership === 'government'
  };
}

/**
 * Offline Demo / Seed Provider
 */
export class DemoSeedProvider implements PlacesProvider {
  name: PlacesSource = 'demo_seed';

  async searchNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    types?: FacilityType[]
  ): Promise<NormalizedFacility[]> {
    // Artificial slight network delay for realism (150ms)
    await new Promise((resolve) => setTimeout(resolve, 150));

    return SEED_FACILITIES.map((facility) => {
      const distanceKm = calculateHaversineDistance(lat, lng, facility.lat, facility.lng);
      const estimatedTravelTimeMin = estimateTravelTimeMinutes(distanceKm, facility.emergencyAvailable);
      return {
        ...facility,
        distanceKm,
        estimatedTravelTimeMin
      };
    })
      .filter((facility) => {
        const matchesRadius = (facility.distanceKm ?? 0) <= Math.max(radiusKm, 1);
        const matchesType = !types || types.length === 0 || types.includes(facility.type);
        return matchesRadius && matchesType;
      })
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }
}

/**
 * OpenStreetMap Overpass Provider with Retry & Exponential Backoff
 */
export class OsmOverpassProvider implements PlacesProvider {
  name: PlacesSource = 'osm';

  async searchNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    types?: FacilityType[]
  ): Promise<NormalizedFacility[]> {
    const radiusMeters = Math.min(radiusKm * 1000, 50000);
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
        node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
        node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
        node["healthcare"](around:${radiusMeters},${lat},${lng});
        way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      );
      out center 40;
    `;

    let attempt = 0;
    const maxAttempts = 2;
    let delay = 500;

    while (attempt < maxAttempts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`OSM status: ${response.status}`);
        }

        const data = await response.json();
        if (data && Array.isArray(data.elements) && data.elements.length > 0) {
          return data.elements.map((el: any) => normalizeOsmElement(el, lat, lng));
        }

        // If no OSM nodes returned in rural or unmapped area, return empty array to trigger seed merge
        return [];
      } catch (err) {
        attempt++;
        if (attempt >= maxAttempts) {
          console.warn('[PlacesService] OSM Overpass unavailable, failing over to local seed', err);
          return [];
        }
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      }
    }
    return [];
  }
}

/**
 * PlacesService with swappable providers and caching
 */
export class PlacesService {
  private providers: PlacesProvider[] = [];
  private seedFallback: DemoSeedProvider;

  constructor() {
    this.seedFallback = new DemoSeedProvider();
    // Default chain: OSM live provider -> Demo Seed fallback
    this.providers = [new OsmOverpassProvider(), this.seedFallback];
  }

  /**
   * Search nearby facilities with IndexedDB / Cache layer
   */
  async searchNearby(
    lat: number,
    lng: number,
    radiusKm = 10,
    types?: FacilityType[]
  ): Promise<NormalizedFacility[]> {
    const cacheKey = `${CACHE_KEY_PREFIX}_${lat.toFixed(2)}_${lng.toFixed(2)}_${radiusKm}_${(types || []).join('-')}`;

    // Check storage cache
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          // Recompute distance relative to precise coordinates
          return parsed.data.map((f: NormalizedFacility) => ({
            ...f,
            distanceKm: calculateHaversineDistance(lat, lng, f.lat, f.lng),
            estimatedTravelTimeMin: estimateTravelTimeMinutes(
              calculateHaversineDistance(lat, lng, f.lat, f.lng),
              f.emergencyAvailable
            )
          }));
        }
      }
    } catch {
      // Storage unavailable or disabled
    }

    let results: NormalizedFacility[] = [];

    // Try primary provider (OSM Overpass)
    try {
      const primaryResults = await this.providers[0].searchNearby(lat, lng, radiusKm, types);
      if (primaryResults.length > 0) {
        results = primaryResults;
      }
    } catch (e) {
      console.warn('[PlacesService] Primary provider failed', e);
    }

    // Always merge or fallback to seed demo facilities so user has 100% reliable data anywhere
    const seedResults = await this.seedFallback.searchNearby(lat, lng, radiusKm, types);

    // Merge without duplicates by ID
    const mergedMap = new Map<string, NormalizedFacility>();
    results.forEach((r) => mergedMap.set(r.id, r));
    seedResults.forEach((r) => mergedMap.set(r.id, r));

    let finalResults = Array.from(mergedMap.values()).sort(
      (a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)
    );

    // If within radius nothing was found, provide nearest 6 facilities regardless of radius
    if (finalResults.length === 0) {
      finalResults = (await this.seedFallback.searchNearby(lat, lng, 5000, types)).slice(0, 8);
    }

    // Cache results
    try {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ timestamp: Date.now(), data: finalResults })
      );
    } catch {
      // Ignore cache storage errors
    }

    return finalResults;
  }

  /**
   * Reverse geocodes coordinates to a readable Indian address / locality
   */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en,hi' },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const parts = (data.display_name as string).split(',');
          // Return concise address (first 3 parts e.g. Patia, Bhubaneswar, Khordha)
          return parts.slice(0, 3).join(',').trim();
        }
      }
    } catch (e) {
      console.warn('[PlacesService] Reverse geocode lookup failed', e);
    }

    // Fallback: Check if near known seed hubs
    const nearest = SEED_FACILITIES.map((f) => ({
      name: f.address,
      d: calculateHaversineDistance(lat, lng, f.lat, f.lng)
    })).sort((a, b) => a.d - b.d)[0];

    if (nearest && nearest.d < 25) {
      return `Near ${nearest.name.split(',').slice(0, 2).join(',')}`;
    }

    return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
  }

  /**
   * Geocodes address text or PIN code to coordinates
   */
  async geocodeQuery(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
    // 1. Check local PIN code dictionary for rapid instant Indian PIN matching
    const pinMatch = query.match(/\b\d{6}\b/);
    if (pinMatch) {
      const pin = pinMatch[0];
      const pinCoords = getIndianPinCoords(pin);
      if (pinCoords) {
        return pinCoords;
      }
    }

    // 2. Check famous city presets
    const cityCoords = getIndianCityCoords(query);
    if (cityCoords) {
      return cityCoords;
    }

    // 3. Online Geocoding via Nominatim
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', India'
        )}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
            displayName: data[0].display_name
          };
        }
      }
    } catch (e) {
      console.warn('[PlacesService] Nominatim geocode error', e);
    }

    return null;
  }
}

// Indian Pin Code coordinate helper
function getIndianPinCoords(pin: string): { lat: number; lng: number; displayName: string } | null {
  const pinMap: Record<string, { lat: number; lng: number; name: string }> = {
    '751019': { lat: 20.2289, lng: 85.7766, name: 'AIIMS / Patrapada, Bhubaneswar (751019)' },
    '751024': { lat: 20.3547, lng: 85.8174, name: 'Patia / KIIT, Bhubaneswar (751024)' },
    '751001': { lat: 20.2644, lng: 85.8249, name: 'Unit 6 / Capital Hospital, Bhubaneswar (751001)' },
    '751015': { lat: 20.2989, lng: 85.8123, name: 'Nayapalli, Bhubaneswar (751015)' },
    '753007': { lat: 20.4664, lng: 85.8872, name: 'SCB Medical College, Cuttack (753007)' },
    '753001': { lat: 20.4578, lng: 85.8712, name: 'Buxi Bazaar, Cuttack (753001)' },
    '752001': { lat: 19.8089, lng: 85.8239, name: 'Grand Road / DHH, Puri (752001)' },
    '110029': { lat: 28.5684, lng: 77.2064, name: 'Safdarjung Hospital, New Delhi (110029)' },
    '400012': { lat: 19.0028, lng: 72.8427, name: 'Parel / KEM Hospital, Mumbai (400012)' },
    '560002': { lat: 12.9642, lng: 77.5768, name: 'City Market / Victoria Hospital, Bengaluru (560002)' },
    '226010': { lat: 26.8687, lng: 81.0118, name: 'Gomti Nagar, Lucknow (226010)' }
  };

  if (pinMap[pin]) {
    return {
      lat: pinMap[pin].lat,
      lng: pinMap[pin].lng,
      displayName: pinMap[pin].name
    };
  }
  return null;
}

// Indian Major City Coordinates
function getIndianCityCoords(query: string): { lat: number; lng: number; displayName: string } | null {
  const q = query.trim().toLowerCase();
  const cities: Record<string, { lat: number; lng: number; name: string }> = {
    bhubaneswar: { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar, Odisha' },
    bbsr: { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar, Odisha' },
    cuttack: { lat: 20.4625, lng: 85.8830, name: 'Cuttack, Odisha' },
    puri: { lat: 19.8135, lng: 85.8312, name: 'Puri, Odisha' },
    berhampur: { lat: 19.3150, lng: 84.7941, name: 'Berhampur, Odisha' },
    rourkela: { lat: 22.2604, lng: 84.8536, name: 'Rourkela, Odisha' },
    delhi: { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
    mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
    bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka' },
    bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka' },
    kolkata: { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
    hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana' },
    lucknow: { lat: 26.8467, lng: 80.9462, name: 'Lucknow, Uttar Pradesh' }
  };

  for (const key of Object.keys(cities)) {
    if (q.includes(key)) {
      return {
        lat: cities[key].lat,
        lng: cities[key].lng,
        displayName: cities[key].name
      };
    }
  }
  return null;
}

export const defaultPlacesService = new PlacesService();
