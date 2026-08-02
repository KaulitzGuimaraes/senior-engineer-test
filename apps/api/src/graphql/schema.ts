import { createSchema } from 'graphql-yoga';
import type { DestinationRankingService } from '../application/destination-ranking.service';
import { createResolvers } from './resolvers';
import { typeDefs } from './type-defs';

export const createAppSchema = (rankingService: DestinationRankingService) =>
  createSchema({
    typeDefs,
    resolvers: createResolvers(rankingService),
  });
