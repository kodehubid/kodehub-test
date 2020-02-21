'use strict';

import {
  EmailAddressTypeDefinition,
  DateTimeTypeDefinition
} from 'graphql-scalars';
import { gql } from 'apollo-server-express';
import userSchema from './user';
import messageSchema from './message';
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

const customsTypeScalars = [EmailAddressTypeDefinition, DateTimeTypeDefinition];

export default [...customsTypeScalars, linkSchema, userSchema, messageSchema];
