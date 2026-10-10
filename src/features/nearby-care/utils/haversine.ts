/**
 * Calculates straight-line distance between two coordinates in kilometers using the Haversine formula.
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lon1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lon2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers (rounded to 2 decimal places)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimates travel time in minutes based on Indian road and traffic heuristics.
 * Urban traffic averages ~20-25 km/h, rural/semi-urban ~35-40 km/h.
 * @param distanceKm Distance in kilometers
 * @param isEmergency Whether emergency ambulance transit is assumed
 * @returns Travel time in minutes
 */
export function estimateTravelTimeMinutes(
  distanceKm: number,
  isEmergency = false
): number {
  if (distanceKm <= 0) return 1;

  let avgSpeedKmh = 22; // Average urban Indian speed
  if (distanceKm > 15) {
    avgSpeedKmh = 35; // Suburban / arterial roads
  } else if (distanceKm > 30) {
    avgSpeedKmh = 45; // Highway stretch
  }

  if (isEmergency) {
    avgSpeedKmh *= 1.35; // Ambulance siren priority
  }

  const hours = distanceKm / avgSpeedKmh;
  const minutes = Math.round(hours * 60) + 2; // +2 min dispatch buffer
  return Math.max(2, minutes);
}
