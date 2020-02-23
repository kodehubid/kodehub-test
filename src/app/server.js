import 'dotenv/config';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import apolloServerConfig from './configs/apollo-server';
import connectToDatabase from './mongoose';
import { normalizePort } from '../shared/utils/normalize';
import app from './express';
import configs from './configs';
import handleNodeEvent from './event-handler';

const APP_PORT = normalizePort(configs.app.port);
const APP_ENV = process.env.NODE_ENV;

// create an apollo server
const server = new ApolloServer(apolloServerConfig());

// apply apolloserver middleware with a path to the app
const GRAPHQL_PATH = '/graphql';
server.applyMiddleware({ app, path: GRAPHQL_PATH });

// create http server and install subscription handler
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

/**
 * Start the server up
 */
(async function startServer() {
  try {
    // connecting to database..
    const mongoose = await connectToDatabase();
    // starting an http server listen by port
    const httpServerConnect = httpServer.listen({ port: APP_PORT }, () => {
      const address = httpServerConnect.address();
      console.log(
        `Apollo Server ${ APP_ENV } running on http://localhost:${ address.port }${ GRAPHQL_PATH }`
      );
    });
    // handler for application level event
    handleNodeEvent(httpServerConnect, mongoose);
  } catch (error) {
    console.error('>>>', error.message);
    console.info(error.stack);
  }
})();
