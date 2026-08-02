export type ActivityId =
  'SKIING' | 'SURFING' | 'OUTDOOR_SIGHTSEEING' | 'INDOOR_SIGHTSEEING';

export interface ActivityScore {
  activity: ActivityId;
  score: number;
  rating: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  reasons: string[];
}

export interface RankedDay {
  date: string;
  weather: {
    weatherCode: number;
    temperatureMin: number;
    temperatureMax: number;
    precipitation: number;
    snowfall: number;
    windSpeed: number;
    sunshineHours: number;
    waveHeight: number | null;
  };
  activities: ActivityScore[];
}

export interface DestinationRanking {
  generatedAt: string;
  location: {
    name: string;
    country: string;
    region: string | null;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  days: RankedDay[];
}

export interface DestinationRankingData {
  destinationRanking: DestinationRanking;
}
