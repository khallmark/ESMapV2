import { app, initializeApolloServer } from './app';

const port = process.env.PORT || 3001;

async function bootstrap() {
  await initializeApolloServer();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
  });
}

bootstrap().catch(console.error);