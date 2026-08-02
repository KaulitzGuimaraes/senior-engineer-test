import type { DailyWeather, Location } from '@app/shared';
import { UpstreamError } from '../../application/errors';
import type { WeatherProvider } from '../../application/ports';
import { marineSchema, weatherSchema, type WeatherResponse } from './schemas';

export class OpenMeteoWeatherProvider implements WeatherProvider {
  async forecast(location: Location): Promise<DailyWeather[]> {
    const common = {
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      timezone: 'auto',
      forecast_days: '7',
    };

    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
    weatherUrl.search = new URLSearchParams({
      ...common,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'rain_sum',
        'snowfall_sum',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'cloud_cover_mean',
        'sunshine_duration',
      ].join(','),
    }).toString();

    const marineUrl = new URL('https://marine-api.open-meteo.com/v1/marine');
    marineUrl.search = new URLSearchParams({
      ...common,
      daily: 'wave_height_max,wave_period_max',
    }).toString();

    const [weatherResponse, marineResponse] = await Promise.all([
      fetch(weatherUrl, { signal: AbortSignal.timeout(7_000) }).catch(
        () => null,
      ),
      fetch(marineUrl, { signal: AbortSignal.timeout(7_000) }).catch(
        () => null,
      ),
    ]);

    if (!weatherResponse?.ok) {
      throw new UpstreamError('Weather service is unavailable');
    }

    const parsedWeather = weatherSchema.safeParse(await weatherResponse.json());
    if (!parsedWeather.success) {
      throw new UpstreamError('Weather service returned invalid data');
    }

    const marineByDate = await this.mapMarineForecast(marineResponse);
    return this.mapWeatherForecast(parsedWeather.data.daily, marineByDate);
  }

  private async mapMarineForecast(
    response: Response | null,
  ): Promise<Map<string, { height: number | null; period: number | null }>> {
    if (!response?.ok) return new Map();

    const parsed = marineSchema.safeParse(await response.json());
    if (!parsed.success || !parsed.data.daily) return new Map();

    const marine = parsed.data.daily;
    return new Map(
      marine.time.map((date, index) => [
        date,
        {
          height: marine.wave_height_max[index] ?? null,
          period: marine.wave_period_max[index] ?? null,
        },
      ]),
    );
  }

  private mapWeatherForecast(
    daily: WeatherResponse['daily'],
    marineByDate: Map<string, { height: number | null; period: number | null }>,
  ): DailyWeather[] {
    return daily.time.map((date, index) => {
      const marine = marineByDate.get(date);
      return {
        date,
        weatherCode: daily.weather_code[index] ?? 0,
        temperatureMin: daily.temperature_2m_min[index] ?? 0,
        temperatureMax: daily.temperature_2m_max[index] ?? 0,
        precipitation: daily.precipitation_sum[index] ?? 0,
        rain: daily.rain_sum[index] ?? 0,
        snowfall: daily.snowfall_sum[index] ?? 0,
        windSpeed: daily.wind_speed_10m_max[index] ?? 0,
        windGusts: daily.wind_gusts_10m_max[index] ?? 0,
        cloudCover: daily.cloud_cover_mean[index] ?? 0,
        sunshineHours:
          Math.round(((daily.sunshine_duration[index] ?? 0) / 3600) * 10) / 10,
        waveHeight: marine?.height ?? null,
        wavePeriod: marine?.period ?? null,
      };
    });
  }
}
