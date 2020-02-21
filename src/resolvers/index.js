'use strict';

import { EmailAddressResolver, DateTimeResolver } from 'graphql-scalars';
import userResolvers from './user';
import messageResolvers from './message';

const customScalars = {
  EmailAddress: EmailAddressResolver,
  DateTime: DateTimeResolver
};
export default [customScalars, userResolvers, messageResolvers];
