import { cacheExchange, createClient, fetchExchange } from 'urql';

export const graphQLClient = createClient({
  url: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, fetchExchange],
});
