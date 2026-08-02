import { GraphQLError } from 'graphql';
import { createYoga } from 'graphql-yoga';
import {
  ApplicationError,
  type ApplicationErrorCode,
} from '../application/errors';
import type { DestinationRankingService } from '../application/destination-ranking.service';
import { createAppSchema } from './schema';

interface PublicErrorDetails {
  code: ApplicationErrorCode | 'INTERNAL_SERVER_ERROR';
  message: string;
  status: number;
}

const unwrapGraphQLError = (error: unknown): unknown => {
  let current = error;

  while (typeof current === 'object' && current !== null) {
    const original = (current as { originalError?: unknown }).originalError;
    if (!original || original === current) break;
    current = original;
  }

  return current;
};

const getSafeGraphQLErrorDetails = (
  error: unknown,
): PublicErrorDetails | undefined => {
  if (typeof error !== 'object' || error === null) return undefined;

  const candidate = error as {
    extensions?: Record<string, unknown>;
    message?: unknown;
  };
  const code = candidate.extensions?.['code'];
  const status = candidate.extensions?.['status'];
  if (
    (code === 'BAD_USER_INPUT' ||
      code === 'NOT_FOUND' ||
      code === 'UPSTREAM_SERVICE_UNAVAILABLE') &&
    typeof status === 'number' &&
    typeof candidate.message === 'string'
  ) {
    return { code, message: candidate.message, status };
  }

  return undefined;
};

const toPublicErrorDetails = (error: unknown): PublicErrorDetails => {
  const directDetails = getSafeGraphQLErrorDetails(error);
  if (directDetails) return directDetails;

  const original = unwrapGraphQLError(error);
  const wrappedDetails = getSafeGraphQLErrorDetails(original);
  if (wrappedDetails) return wrappedDetails;

  if (original instanceof ApplicationError) {
    return {
      code: original.code,
      message: original.message,
      status: original.status,
    };
  }

  console.error(original ?? error);
  return {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Unable to create a destination ranking right now',
    status: 500,
  };
};

export const maskGraphQLError = (error: unknown) => {
  const details = toPublicErrorDetails(error);

  return new GraphQLError(details.message, {
    extensions: {
      code: details.code,
      status: details.status,
      http: { status: details.status },
    },
  });
};

export const createGraphQLYoga = (rankingService: DestinationRankingService) =>
  createYoga({
    schema: createAppSchema(rankingService),
    graphqlEndpoint: '/graphql',
    landingPage: false,
    logging: false,
    maskedErrors: { maskError: maskGraphQLError },
  });
