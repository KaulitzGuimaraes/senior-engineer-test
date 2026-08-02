import type { DailyWeather } from '@app/shared';
import { describe, expect, it, vi } from 'vitest';
import { DestinationRankingService } from '../application/destination-ranking.service';
import { NotFoundError, UpstreamError } from '../application/errors';
import type { GeocodingProvider, WeatherProvider } from '../application/ports';
import { createGraphQLYoga } from './yoga';

const requestRanking = async (
  geocoding: GeocodingProvider,
  weather: WeatherProvider = {
    forecast: vi.fn<() => Promise<DailyWeather[]>>(),
  },
  city = 'Lisbon',
) => {
  const yoga = createGraphQLYoga(
    new DestinationRankingService(geocoding, weather),
  );

  return yoga.fetch('http://localhost/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `query ($city: String!) { destinationRanking(city: $city) { generatedAt } }`,
      variables: { city },
    }),
  });
};

describe('GraphQL error contract', () => {
  it('returns a typed 400 for invalid input', async () => {
    const search = vi.fn();
    const response = await requestRanking({ search }, undefined, 'x');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.errors[0].extensions).toMatchObject({
      code: 'BAD_USER_INPUT',
      status: 400,
    });
    expect(search).not.toHaveBeenCalled();
  });

  it('returns a typed 404 without leaking implementation details', async () => {
    const response = await requestRanking({
      search: vi
        .fn()
        .mockRejectedValue(new NotFoundError('City was not found')),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toMatchObject({
      errors: [
        {
          message: 'City was not found',
          extensions: { code: 'NOT_FOUND', status: 404 },
        },
      ],
    });
  });

  it('returns a typed service-unavailable response for provider failures', async () => {
    const response = await requestRanking({
      search: vi
        .fn()
        .mockRejectedValue(new UpstreamError('Weather service is unavailable')),
    });
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.errors[0].extensions).toMatchObject({
      code: 'UPSTREAM_SERVICE_UNAVAILABLE',
      status: 503,
    });
  });

  it('masks unknown errors and returns HTTP 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = await requestRanking({
      search: vi.fn().mockRejectedValue(new Error('database password leaked')),
    });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      errors: [
        {
          message: 'Unable to create a destination ranking right now',
          extensions: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
        },
      ],
    });
    expect(JSON.stringify(body)).not.toContain('database password');
  });
});
