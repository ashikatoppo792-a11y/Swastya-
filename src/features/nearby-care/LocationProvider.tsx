import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GeolocationStatus, UserCoordinates } from './types';
import { defaultPlacesService } from './PlacesService';
import { PrePermissionDialog } from './PrePermissionDialog';

interface LocationContextType {
  status: GeolocationStatus;
  coordinates: UserCoordinates | null;
  errorMessage: string | null;
  accuracyWarning: string | null;
  isPrePermissionOpen: boolean;
  requestCurrentLocation: () => void;
  setManualLocation: (lat: number, lng: number, address?: string) => void;
  clearLocation: () => void;
  openPrePermission: () => void;
  closePrePermission: () => void;
}

const STORAGE_KEY = 'swasthya_user_location';

// Default initial fallback (Bhubaneswar Hub)
const DEFAULT_COORDINATES: UserCoordinates = {
  lat: 20.2961,
  lng: 85.8245,
  accuracyMeters: 50,
  timestamp: Date.now(),
  resolvedAddress: 'Bhubaneswar, Odisha (Default Demo Area)',
  isManual: true
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [coordinates, setCoordinates] = useState<UserCoordinates | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return DEFAULT_COORDINATES;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null);
  const [isPrePermissionOpen, setIsPrePermissionOpen] = useState<boolean>(false);

  // Sync to session storage (privacy consent: only within session)
  useEffect(() => {
    if (coordinates) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(coordinates));
      } catch {
        // Ignore
      }
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [coordinates]);

  const executeBrowserGeolocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      setErrorMessage('Geolocation API is not supported by your browser.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);
    setAccuracyWarning(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        let warning: string | null = null;
        let newStatus: GeolocationStatus = 'granted';

        // Check if accuracy radius > 500m
        if (accuracy > 500) {
          newStatus = 'low_accuracy';
          warning = `Location accuracy is low (±${Math.round(accuracy)} m). You can adjust your location on the map or search by PIN code.`;
        }

        setStatus(newStatus);
        setAccuracyWarning(warning);

        // Reverse geocode in background
        const resolved = await defaultPlacesService.reverseGeocode(latitude, longitude);

        setCoordinates({
          lat: latitude,
          lng: longitude,
          accuracyMeters: Math.round(accuracy),
          timestamp: pos.timestamp,
          resolvedAddress: resolved,
          isManual: false
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setErrorMessage('Location permission was denied. You can search by City or PIN code.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setStatus('unavailable');
          setErrorMessage('Location information is currently unavailable. Using manual fallback.');
        } else if (err.code === err.TIMEOUT) {
          setStatus('timeout');
          setErrorMessage('Location request timed out. Please try again or search manually.');
        } else {
          setStatus('unavailable');
          setErrorMessage(err.message || 'Unable to retrieve location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  const requestCurrentLocation = useCallback(() => {
    // If user has already granted in this session or dismissed pre-permission, trigger directly
    if (status === 'granted' || status === 'low_accuracy') {
      executeBrowserGeolocation();
    } else {
      setIsPrePermissionOpen(true);
    }
  }, [status, executeBrowserGeolocation]);

  const setManualLocation = useCallback(async (lat: number, lng: number, address?: string) => {
    let resolved = address;
    if (!resolved) {
      resolved = await defaultPlacesService.reverseGeocode(lat, lng);
    }
    setCoordinates({
      lat,
      lng,
      accuracyMeters: 20,
      timestamp: Date.now(),
      resolvedAddress: resolved,
      isManual: true
    });
    setStatus('granted');
    setErrorMessage(null);
    setAccuracyWarning(null);
  }, []);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setStatus('idle');
    setErrorMessage(null);
    setAccuracyWarning(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        status,
        coordinates,
        errorMessage,
        accuracyWarning,
        isPrePermissionOpen,
        requestCurrentLocation,
        setManualLocation,
        clearLocation,
        openPrePermission: () => setIsPrePermissionOpen(true),
        closePrePermission: () => setIsPrePermissionOpen(false)
      }}
    >
      {children}
      <PrePermissionDialog
        isOpen={isPrePermissionOpen}
        onConfirm={() => {
          setIsPrePermissionOpen(false);
          executeBrowserGeolocation();
        }}
        onChooseManual={() => {
          setIsPrePermissionOpen(false);
          // Keep current fallback coordinates and prompt user to search
        }}
        onCancel={() => setIsPrePermissionOpen(false)}
      />
    </LocationContext.Provider>
  );
};

export const useGeolocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within a LocationProvider');
  }
  return context;
};
