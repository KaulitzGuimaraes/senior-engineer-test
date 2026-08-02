import { createApiServer } from './server';

const port = Number(process.env.API_PORT ?? 4000);
const server = createApiServer();

server.listen(port, () => {
  console.log(`GraphQL API ready at http://localhost:${port}/graphql`);
});
