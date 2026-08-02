import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { rankingService as defaultRankingService } from './application/container';
import type { DestinationRankingService } from './application/destination-ranking.service';
import { createGraphQLYoga } from './graphql/yoga';

interface ApiErrorBody {
  error: {
    code: 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR';
    message: string;
    status: 404 | 500;
  };
}

export const createApiErrorBody = (
  status: 404 | 500,
  message: string,
): ApiErrorBody => ({
  error: {
    code: status === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
    message,
    status,
  },
});

const sendJsonError = (
  response: ServerResponse,
  status: 404 | 500,
  message: string,
) => {
  response.statusCode = status;
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(createApiErrorBody(status, message)));
};

export const createApiRequestHandler = (
  rankingService: DestinationRankingService,
) => {
  const yoga = createGraphQLYoga(rankingService);

  return async (request: IncomingMessage, response: ServerResponse) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    if (pathname !== '/graphql') {
      sendJsonError(response, 404, `API route ${pathname} was not found`);
      return;
    }

    try {
      await yoga(request, response);
    } catch (error) {
      console.error(error);
      if (!response.headersSent) {
        sendJsonError(response, 500, 'The API encountered an unexpected error');
      } else {
        response.end();
      }
    }
  };
};

export const createApiServer = (
  rankingService: DestinationRankingService = defaultRankingService,
) => createServer(createApiRequestHandler(rankingService));
