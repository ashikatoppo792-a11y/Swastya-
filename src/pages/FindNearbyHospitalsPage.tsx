import React from 'react';
import { LocationProvider } from '../features/nearby-care/LocationProvider';
import { NearbyCareFinderPage } from '../features/nearby-care/NearbyCareFinderPage';

interface FindNearbyHospitalsProps {
  currentLanguage?: string;
  initialSpecialty?: string;
  isEmergencyMode?: boolean;
  onBookAtHospital?: (hospitalName: string) => void;
  isClinicianMode?: boolean;
}

export const FindNearbyHospitalsPage: React.FC<FindNearbyHospitalsProps> = (props) => {
  return (
    <LocationProvider>
      <NearbyCareFinderPage {...props} />
    </LocationProvider>
  );
};

export default FindNearbyHospitalsPage;
