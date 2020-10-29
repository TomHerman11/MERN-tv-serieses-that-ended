import { MongoClient } from 'mongodb';
import express from 'express';
import cors from 'cors';
const { ApolloServer } = require('apollo-server-express');
import { typeDefs, resolversWithMongoDb } from './graphql/schema';

const PORT = 4000;
const MONGO_URL = 'mongodb://localhost:27017';
const MONGO_DB_NAME = 'tv-shows-that-ended';

const app = express();

// Allow requests from 'client':
app.use('*', cors({ origin: 'http://localhost:3000' }));

const start = async () => {
  try {
    // Load MongoDB:
    const db = (await MongoClient.connect(MONGO_URL)).db(MONGO_DB_NAME);
    // console.log(db);
    const seriesesDb = db.collection('shows');

    const resolvers = resolversWithMongoDb(seriesesDb);
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    apolloServer.applyMiddleware({ app });

    // Server listen:
    app.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );

  } catch (e) {
    console.log("Error catched:", e);
  }
}

start();
