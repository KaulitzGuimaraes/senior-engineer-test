import { OpenMeteoGeocodingProvider } from '../infrastructure/open-meteo/geocoding.provider';
import { OpenMeteoWeatherProvider } from '../infrastructure/open-meteo/weather.provider';
import { DestinationRankingService } from './destination-ranking.service';

export const rankingService = new DestinationRankingService(
  new OpenMeteoGeocodingProvider(),
  new OpenMeteoWeatherProvider(),
);
