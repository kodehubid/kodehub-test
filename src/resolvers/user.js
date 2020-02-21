'use strict';
import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isAuthenticated } from './authorization';
import { generateUserPasswordHash } from '../models/user';

const createToken = async (user, secret, expiresTime) => {
  const { id, email, username, role } = user;
  const tokenExpireTime = expiresTime || '30m';
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn: tokenExpireTime
  });
};

export default {
  Query: {
    users: (parent, args, { models }) => {
      return models.User.find();
    },
    user: (parent, { id }, { models }) => {
      return models.User.findById(id);
    },
    me: (parent, args, { me, models }) => {
      if (!me) {
        return null;
      }

      return models.User.findById(me.id);
    }
  },
  Mutation: {
    signUp: async (parent, { input }, { models, secret }) => {
      const user = await models.User.create(input);
      return { token: createToken(user, secret) };
    },
    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);
      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      return { token: createToken(user, secret) };
    },
    updateUser: async (parent, { input }, { models }) => {
      const { id, ...rest } = input;
      const updates = rest;
      if (updates.password) {
        updates.password = await generateUserPasswordHash(rest.password);
      }
      return models.User.findOneAndUpdate({ _id: id }, updates);
    },
    deleteUser: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) => {
        let hasDeleted = false;
        const deleteStatus = await models.User.deleteOne({ _id: id });
        if (deleteStatus) {
          hasDeleted = true;
        }
        return hasDeleted;
      }
    )
  },
  User: {
    messages: async (user, args, { loaders }) => {
      return (await loaders.message.load(user.id)) || [];
    }
  }
};
