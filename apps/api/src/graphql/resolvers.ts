import { GraphQLError } from 'graphql';
import { ApplicationError } from '../application/errors';
import type { DestinationRankingService } from '../application/destination-ranking.service';

const toGraphQLError = (error: unknown) => {
  if (!(error instanceof ApplicationError)) return error;

  return new GraphQLError(error.message, {
    extensions: {
      code: error.code,
      status: error.status,
      http: { status: error.status },
    },
  });
};

export const createResolvers = (rankingService: DestinationRankingService) => ({
  Query: {
    health: () => 'ok',
    destinationRanking: async (_root: unknown, args: { city: string }) => {
      try {
        return await rankingService.execute(args.city);
      } catch (error) {
        throw toGraphQLError(error);
      }
    },
  },
});
