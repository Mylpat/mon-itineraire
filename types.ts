
export enum TransportMode {
  CAR = 'Voiture',
  PEDESTRIAN = 'Piéton',
  TRANSIT = 'Transport en commun',
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ItineraryRequest {
  name: string;
  transportMode: TransportMode;
  start: string;
  destination: string;
  steps: string[];
  currentLocation: Coordinates | null;
}

export interface ItineraryResponse {
  description: string;
  mapUrl: string | null;
  routeName: string;
}
