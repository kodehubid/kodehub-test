'use strict';

import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';

export const isAdmin = (parent, args, { user: { role } }) => {
  return role === 'ADMIN'
    ? skip
    : new ForbiddenError('Not authorized as admin.');
};

export const isAuthenticated = (parent, args, { user }) => {
  return user ? skip : new ForbiddenError('Not authenticated as user.');
};

export const isMessageOwner = async (parent, { id }, { models, user }) => {
  const message = await models.Message.findByPk(id, { raw: true });
  if (message.userId !== user.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }
  return skip;
};
