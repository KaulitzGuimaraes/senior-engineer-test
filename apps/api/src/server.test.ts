import type { IncomingMessage, ServerResponse } from 'node:http';
import { describe, expect, it, vi } from 'vitest';
import { DestinationRankingService } from './application/destination-ranking.service';
import { createApiRequestHandler } from './server';

describe('API route errors', () => {
  it('returns a consistent JSON 404 for unknown API routes', async () => {
    const service = new DestinationRankingService(
      { search: vi.fn() },
      { forecast: vi.fn() },
    );
    const handler = createApiRequestHandler(service);
    const setHeader = vi.fn();
    const end = vi.fn();
    const response = {
      end,
      setHeader,
      statusCode: 200,
    } as unknown as ServerResponse;

    await handler({ url: '/missing' } as IncomingMessage, response);

    expect(response.statusCode).toBe(404);
    expect(setHeader).toHaveBeenCalledWith(
      'content-type',
      'application/json; charset=utf-8',
    );
    expect(JSON.parse(String(end.mock.calls[0]?.[0]))).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'API route /missing was not found',
        status: 404,
      },
    });
  });
});
