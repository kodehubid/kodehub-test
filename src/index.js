import 'dotenv/config';
import express from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { AuthenticationError } from 'apollo-server';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import depthLimit from 'graphql-depth-limit';
import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import DataLoader from 'dataloader';

const dev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());

const batchMessages = async (keys, models) => {
  const messages = await models.Message.find({
    user: {
      $in: keys
    }
  });
  const dataMap = messages.reduce((acc, obj) => {
    acc[obj.user] = [...(acc[obj.user] || []), obj];
    return acc;
  }, {});
  const batchedMessage = keys.map(key => dataMap[key]);
  return batchedMessage;
};

const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const user = await jwt.verify(token, process.env.SECRET);
      return user;
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  validationRules: [depthLimit(process.env.GRAPHQL_DEPTH_LIMIT || 10)],
  introspection: dev ? true : false,
  context: async ({ req, connection }) => {
    // create context for Subscription
    if (connection) {
      return { models };
    }
    // create context for general graphql Query & Mutation
    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          message: new DataLoader(keys => batchMessages(keys, models))
        }
      };
    }
  }
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

/**
 * Connect to the database and start the server up
 */
connectDb().then(async () => {
  const isTest = process.env.TEST_DB;
  if (isTest) {
    // clear db
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({})
    ]);
    await createUsersWithMessages();
  }
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${ port }/graphql`);
  });
});

async function createUsersWithMessages() {
  const user1 = new models.User({
    username: 'rwieruch',
    createdAt: Date.now(),
    email: 'rwi@getMaxListeners.com',
    password: 'password123',
    _id: '5e4e555cbf31ef2588e22124',
    role: 'USER'
  });
  const user2 = new models.User({
    username: 'arrlancore',
    createdAt: Date.now(),
    email: 'ar@getMaxListeners.com',
    password: 'password123',
    _id: '5e4e555cbf31ef2588e22125',
    role: 'ADMIN'
  });
  const message1 = new models.Message({
    text: 'Published the Road to learn React',
    user: user1.id,
    createdAt: Date.now(),
    _id: '5e4e555cbf31ef2588e22126'
  });
  const message2 = new models.Message({
    text: 'Happy to release ...',
    user: user2.id,
    createdAt: Date.now(),
    _id: '5e4e555cbf31ef2588e22127'
  });
  const message3 = new models.Message({
    text: 'Published a complete ...',
    user: user2.id,
    createdAt: Date.now(),
    _id: '5e4e555cbf31ef2588e22128'
  });
  await message1.save();
  await message2.save();
  await message3.save();
  await user1.save();
  await user2.save();
  console.log('DATA CREATED');
}
