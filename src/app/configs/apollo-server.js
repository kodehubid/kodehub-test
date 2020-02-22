'use strict';
import depthLimit from 'graphql-depth-limit';
import allDataLoader from '../../shared/dataloaders';
import { getUserByToken } from '../../shared/utils/jwt';
import { gql } from 'apollo-server-express';
import models from '../models';
import {
  EmailAddressResolver,
  EmailAddressTypeDefinition,
  DateTimeResolver,
  DateTimeTypeDefinition
} from 'graphql-scalars';

import user from '../../user';
import message from '../../message';

const dev = process.env.NODE_ENV === 'development';

// Introspection information at the GraphQL Playground (UI)
const introspection = dev ? true : false;

const customScalars = {
  EmailAddress: EmailAddressResolver,
  DateTime: DateTimeResolver
};
const customsTypeScalars = [EmailAddressTypeDefinition, DateTimeTypeDefinition];

/**
 * modularize the GraphQL schema by domains
 * the linkSchema defines all types shared within the schemas
 * so application can runs with a stitched schema instead of one global schema
 */
const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

const apolloServerConfig = () => {
  return {
    typeDefs: [
      ...customsTypeScalars,
      linkSchema,
      user.userSchema,
      message.messageSchema
    ],
    resolvers: [customScalars, user.userResolver, message.messageResolver],
    validationRules: [depthLimit(process.env.GRAPHQL_DEPTH_LIMIT || 7)],
    introspection,
    context: createContext
  };
};

// context for the resolver function
async function createContext({ req, connection }) {
  // create context for Subscription
  if (connection) {
    return { models };
  }
  // create context for general graphql query & mutation
  if (req) {
    const user = await getUserByToken(req);
    return {
      models,
      me: user,
      secret: process.env.SECRET,
      loaders: allDataLoader(models)
    };
  }
}

export default apolloServerConfig;
