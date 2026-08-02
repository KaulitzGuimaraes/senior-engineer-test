import type { DailyWeather, Location } from '@app/shared';

export interface GeocodingProvider {
  search(city: string): Promise<Location>;
}

export interface WeatherProvider {
  forecast(location: Location): Promise<DailyWeather[]>;
}
