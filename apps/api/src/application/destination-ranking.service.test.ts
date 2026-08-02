import type { DailyWeather, Location } from '@app/shared';
import { describe, expect, it, vi } from 'vitest';
import { DestinationRankingService } from './destination-ranking.service';
import { UserInputError } from './errors';
import type { GeocodingProvider, WeatherProvider } from './ports';

const location: Location = {
  name: 'Lisbon',
  country: 'Portugal',
  region: 'Lisbon',
  latitude: 38.72,
  longitude: -9.14,
  timezone: 'Europe/Lisbon',
};

const weather: DailyWeather = {
  date: '2026-08-03',
  weatherCode: 1,
  temperatureMin: 16,
  temperatureMax: 25,
  precipitation: 0,
  rain: 0,
  snowfall: 0,
  windSpeed: 12,
  windGusts: 20,
  cloudCover: 15,
  sunshineHours: 10,
  waveHeight: 1.4,
  wavePeriod: 10,
};

const createProviders = () => {
  const geocoding: GeocodingProvider = {
    search: vi.fn().mockResolvedValue(location),
  };
  const forecast: WeatherProvider = {
    forecast: vi.fn().mockResolvedValue([weather]),
  };
  return { forecast, geocoding };
};

describe('DestinationRankingService', () => {
  it('rejects invalid input before calling either provider', async () => {
    const { forecast, geocoding } = createProviders();
    const service = new DestinationRankingService(geocoding, forecast);

    await expect(service.execute(' x ')).rejects.toBeInstanceOf(UserInputError);
    expect(geocoding.search).not.toHaveBeenCalled();
    expect(forecast.forecast).not.toHaveBeenCalled();
  });

  it('coordinates providers and returns activities ordered by score', async () => {
    const { forecast, geocoding } = createProviders();
    const service = new DestinationRankingService(geocoding, forecast);

    const result = await service.execute('  Lisbon  ');

    expect(geocoding.search).toHaveBeenCalledWith('Lisbon');
    expect(forecast.forecast).toHaveBeenCalledWith(location);
    expect(result.location).toEqual(location);
    expect(result.days).toHaveLength(1);
    expect(result.days[0]?.weather).toEqual(weather);
    expect(result.days[0]?.activities.map(({ score }) => score)).toEqual(
      [...(result.days[0]?.activities ?? [])]
        .map(({ score }) => score)
        .sort((left, right) => right - left),
    );
  });

  it('does not hide provider errors from the delivery layer', async () => {
    const { forecast, geocoding } = createProviders();
    const failure = new Error('provider failed');
    vi.mocked(forecast.forecast).mockRejectedValue(failure);
    const service = new DestinationRankingService(geocoding, forecast);

    await expect(service.execute('Lisbon')).rejects.toBe(failure);
  });
});
