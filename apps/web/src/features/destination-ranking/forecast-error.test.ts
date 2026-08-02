import { describe, expect, it } from 'vitest';
import { toForecastError } from './forecast-error';

const queryError = (code: string, status: number, message: string) => ({
  graphQLErrors: [{ extensions: { code, status }, message }],
  message,
});

describe('toForecastError', () => {
  it('maps destination misses to a not-found state', () => {
    expect(
      toForecastError(queryError('NOT_FOUND', 404, 'Unknown city')),
    ).toEqual({
      kind: 'not-found',
      message: 'Unknown city',
      status: 404,
    });
  });

  it('maps validation failures to a client state', () => {
    expect(
      toForecastError(queryError('BAD_USER_INPUT', 400, 'Enter a city')),
    ).toEqual({
      kind: 'client',
      message: 'Enter a city',
      status: 400,
    });
  });

  it('maps unknown API failures to the server state', () => {
    expect(
      toForecastError(
        queryError('INTERNAL_SERVER_ERROR', 500, 'Unable to create ranking'),
      ),
    ).toEqual({
      kind: 'server',
      message: 'Unable to create ranking',
      status: 500,
    });
  });

  it('maps network failures to a retryable service error', () => {
    expect(
      toForecastError({
        graphQLErrors: [],
        message: 'fetch failed',
        networkError: new Error('fetch failed'),
      }),
    ).toEqual({
      kind: 'server',
      message: 'fetch failed',
      status: 503,
    });
  });
});
