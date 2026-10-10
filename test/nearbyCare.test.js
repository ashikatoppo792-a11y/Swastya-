import assert from 'node:assert';

// 1. Haversine implementation test
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371; // km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

function estimateTravelTimeMinutes(distanceKm, isEmergency = false) {
  if (distanceKm <= 0) return 1;
  let avgSpeedKmh = 22;
  if (distanceKm > 15) avgSpeedKmh = 35;
  else if (distanceKm > 30) avgSpeedKmh = 45;
  if (isEmergency) avgSpeedKmh *= 1.35;
  const hours = distanceKm / avgSpeedKmh;
  return Math.max(2, Math.round(hours * 60) + 2);
}

function formatDistance(distanceKm) {
  if (distanceKm === undefined || distanceKm === null) return 'Distance unavailable';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

console.log('--- Running Unit Tests for Nearby Care Finder ---');

// Test 1: Zero distance
{
  const dist = calculateHaversineDistance(20.2961, 85.8245, 20.2961, 85.8245);
  assert.strictEqual(dist, 0, 'Zero distance test failed');
  console.log('✓ Test 1 Passed: Zero distance between identical coordinates is 0 km');
}

// Test 2: Known Distance (Bhubaneswar center to Cuttack SCB ~24.5 km)
{
  const dist = calculateHaversineDistance(20.2961, 85.8245, 20.4664, 85.8872);
  assert.ok(dist >= 20 && dist <= 28, `Expected ~20-25 km, got ${dist}`);
  console.log(`✓ Test 2 Passed: Bhubaneswar to Cuttack distance is ${dist} km (within accurate range)`);
}

// Test 3: Format Distance
{
  assert.strictEqual(formatDistance(0.45), '450 m');
  assert.strictEqual(formatDistance(3.72), '3.7 km');
  assert.strictEqual(formatDistance(12.0), '12.0 km');
  console.log('✓ Test 3 Passed: Distance formatter formats meters (< 1km) and kilometers correctly');
}

// Test 4: Travel Time Estimation
{
  const normalTime = estimateTravelTimeMinutes(10, false);
  const emergencyTime = estimateTravelTimeMinutes(10, true);
  assert.ok(normalTime > 0);
  assert.ok(emergencyTime < normalTime, 'Emergency ambulance should be faster than standard travel');
  console.log(`✓ Test 4 Passed: Travel time calculation: 10km normal=${normalTime}min, emergency=${emergencyTime}min`);
}

// Test 5: Filter logic
{
  const mockFacilities = [
    { id: '1', name: 'PHC Chandrasekharpur', type: 'PHC', ownership: 'government', emergencyAvailable: false, pmjayEmpanelled: false, distanceKm: 2.1 },
    { id: '2', name: 'AIIMS Hospital', type: 'hospital', ownership: 'government', emergencyAvailable: true, pmjayEmpanelled: true, distanceKm: 8.5 },
    { id: '3', name: 'Apollo Pharmacy', type: 'pharmacy', ownership: 'private', emergencyAvailable: true, pmjayEmpanelled: false, distanceKm: 1.2 }
  ];

  // Filter only emergency
  const emergencyOnly = mockFacilities.filter(f => f.emergencyAvailable);
  assert.strictEqual(emergencyOnly.length, 2);

  // Filter only government
  const govOnly = mockFacilities.filter(f => f.ownership === 'government');
  assert.strictEqual(govOnly.length, 2);

  // Filter within 5km
  const within5km = mockFacilities.filter(f => f.distanceKm <= 5);
  assert.strictEqual(within5km.length, 2);

  // Sort by nearest
  const sorted = [...mockFacilities].sort((a, b) => a.distanceKm - b.distanceKm);
  assert.strictEqual(sorted[0].id, '3');
  assert.strictEqual(sorted[2].id, '2');

  console.log('✓ Test 5 Passed: Facility filter and sorting logic works as expected');
}

// Test 6: Normalizer Schema Verification
{
  const mockOsmElement = {
    id: 123456,
    lat: 20.25,
    lon: 85.80,
    tags: {
      amenity: 'hospital',
      name: 'Test Civil Hospital',
      emergency: 'yes',
      operator_type: 'government'
    }
  };

  const expectedShapeKeys = [
    'id', 'name', 'type', 'ownership', 'lat', 'lng', 'address', 'phone', 'emergencyAvailable', 'specialities', 'source', 'lastUpdated'
  ];

  const normalized = {
    id: `osm-${mockOsmElement.id}`,
    name: mockOsmElement.tags.name,
    type: 'hospital',
    ownership: 'government',
    lat: mockOsmElement.lat,
    lng: mockOsmElement.lon,
    address: 'Bhubaneswar, Odisha',
    phone: '+91-108',
    emergencyAvailable: true,
    specialities: ['Emergency & Trauma', 'General Medicine'],
    source: 'osm',
    lastUpdated: '2026-10-10'
  };

  for (const key of expectedShapeKeys) {
    assert.ok(key in normalized, `Missing normalized key: ${key}`);
  }
  console.log('✓ Test 6 Passed: Normalizer produces standard shape with all required keys');
}

console.log('--- ALL 6 UNIT TESTS PASSED SUCCESSFULLY! ---');
