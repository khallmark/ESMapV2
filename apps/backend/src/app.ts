import "reflect-metadata";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { schema } from "@esmapv3/graphql-schemas";
import { prisma, getRecentCalls, getSourceByTag } from "@esmapv3/database";
import callRoutes from './routes/callRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/calls', callRoutes);

async function initializeApolloServer() {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: schema,
      validate: false,
    }),
    context: { prisma, getRecentCalls, getSourceByTag },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

export { app, initializeApolloServer };