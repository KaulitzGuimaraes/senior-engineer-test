import { rankActivities, type DestinationRanking } from '@app/shared';
import { UserInputError } from './errors';
import type { GeocodingProvider, WeatherProvider } from './ports';

export class DestinationRankingService {
  constructor(
    private readonly geocoding: GeocodingProvider,
    private readonly weather: WeatherProvider,
  ) {}

  async execute(city: string): Promise<DestinationRanking> {
    const query = city.trim();
    if (query.length < 2 || query.length > 100) {
      throw new UserInputError(
        'Enter a city or town with at least two characters',
      );
    }

    const location = await this.geocoding.search(query);
    const forecast = await this.weather.forecast(location);

    return {
      location,
      generatedAt: new Date().toISOString(),
      days: forecast.map((weather) => ({
        date: weather.date,
        weather,
        activities: rankActivities(weather),
      })),
    };
  }
}
