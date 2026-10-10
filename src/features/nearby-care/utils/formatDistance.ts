/**
 * Formats distance in km or m for human-friendly display.
 */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || distanceKm === null) {
    return 'Distance unavailable';
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Formats estimated travel time in minutes.
 */
export function formatTravelTime(minutes?: number): string {
  if (!minutes) return 'Approx. 5-10 mins';
  if (minutes < 60) {
    return `~${minutes} mins`;
  }
  const hrs = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `~${hrs} hr ${remainingMins > 0 ? `${remainingMins} min` : ''}`;
}

/**
 * Generates an external maps navigation link.
 */
export function getNavigationUrl(
  destLat: number,
  destLng: number,
  facilityName: string,
  userLat?: number,
  userLng?: number
): string {
  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const encodedName = encodeURIComponent(facilityName);

  if (userLat && userLng) {
    if (isIOS) {
      return `https://maps.apple.com/?saddr=${userLat},${userLng}&daddr=${destLat},${destLng}&q=${encodedName}`;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&destination_place_id=${encodedName}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
}
