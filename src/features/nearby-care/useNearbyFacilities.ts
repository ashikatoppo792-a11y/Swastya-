import { useState, useEffect, useMemo, useCallback } from 'react';
import { NormalizedFacility, NearbyFilters } from './types';
import { useGeolocation } from './LocationProvider';
import { defaultPlacesService } from './PlacesService';

export const DEFAULT_FILTERS: NearbyFilters = {
  facilityTypes: ['hospital', 'clinic', 'PHC', 'CHC', 'pharmacy', 'diagnostic_lab', 'nursing_home'],
  ownership: 'all',
  openNowOnly: false,
  emergencyOnly: false,
  speciality: '',
  maxRadiusKm: 15,
  searchQuery: '',
  sortBy: 'nearest',
  pmjayOnly: false
};

export function useNearbyFacilities(initialFilters?: Partial<NearbyFilters>) {
  const { coordinates } = useGeolocation();
  const [filters, setFilters] = useState<NearbyFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters
  });

  const [rawFacilities, setRawFacilities] = useState<NormalizedFacility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = useCallback(async () => {
    if (!coordinates) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await defaultPlacesService.searchNearby(
        coordinates.lat,
        coordinates.lng,
        filters.maxRadiusKm,
        filters.facilityTypes
      );
      setRawFacilities(data);
    } catch (err: any) {
      console.error('[useNearbyFacilities] Error fetching facilities', err);
      setError('Unable to load nearby facilities. Please try refreshing or checking your network.');
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, filters.maxRadiusKm, filters.facilityTypes]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  // Client-side filtering & sorting
  const filteredFacilities = useMemo(() => {
    let list = [...rawFacilities];

    // Filter by ownership
    if (filters.ownership !== 'all') {
      list = list.filter((f) => f.ownership === filters.ownership);
    }

    // Filter by open now
    if (filters.openNowOnly) {
      list = list.filter((f) => f.openNow);
    }

    // Filter by emergency
    if (filters.emergencyOnly) {
      list = list.filter((f) => f.emergencyAvailable);
    }

    // Filter by PM-JAY / Ayushman Bharat
    if (filters.pmjayOnly) {
      list = list.filter((f) => f.pmjayEmpanelled);
    }

    // Filter by Speciality
    if (filters.speciality.trim()) {
      const specLower = filters.speciality.toLowerCase();
      list = list.filter((f) =>
        f.specialities.some((s) => s.toLowerCase().includes(specLower))
      );
    }

    // Search query
    if (filters.searchQuery.trim()) {
      const queryLower = filters.searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(queryLower) ||
          f.address.toLowerCase().includes(queryLower) ||
          f.specialities.some((s) => s.toLowerCase().includes(queryLower))
      );
    }

    // Sorting
    if (filters.sortBy === 'nearest') {
      list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    } else if (filters.sortBy === 'rating') {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (filters.sortBy === 'triage_match') {
      // Prioritize 24x7 emergency & ICU bed count, then distance
      list.sort((a, b) => {
        if (a.emergencyAvailable && !b.emergencyAvailable) return -1;
        if (!a.emergencyAvailable && b.emergencyAvailable) return 1;
        return (a.distanceKm ?? 0) - (b.distanceKm ?? 0);
      });
    }

    return list;
  }, [rawFacilities, filters]);

  const updateFilters = useCallback((updates: Partial<NearbyFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const expandRadius = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      maxRadiusKm: Math.min(50, prev.maxRadiusKm + 15)
    }));
  }, []);

  return {
    facilities: filteredFacilities,
    rawCount: rawFacilities.length,
    isLoading,
    error,
    filters,
    updateFilters,
    expandRadius,
    refetch: fetchFacilities
  };
}
