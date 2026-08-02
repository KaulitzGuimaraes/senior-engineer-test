import type { Location } from '@app/shared';
import { NotFoundError, UpstreamError } from '../../application/errors';
import type { GeocodingProvider } from '../../application/ports';
import { geocodingSchema } from './schemas';

export class OpenMeteoGeocodingProvider implements GeocodingProvider {
  async search(city: string): Promise<Location> {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.search = new URLSearchParams({
      name: city,
      count: '1',
      language: 'en',
      format: 'json',
    }).toString();

    const response = await fetch(url, {
      signal: AbortSignal.timeout(6_000),
    }).catch(() => null);
    if (!response?.ok) {
      throw new UpstreamError('Location service is unavailable');
    }

    const parsed = geocodingSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new UpstreamError('Location service returned invalid data');
    }

    const match = parsed.data.results?.[0];
    if (!match) {
      throw new NotFoundError(`We could not find “${city}”`);
    }

    return {
      name: match.name,
      country: match.country,
      region: match.admin1 ?? null,
      latitude: match.latitude,
      longitude: match.longitude,
      timezone: match.timezone,
    };
  }
}
