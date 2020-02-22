'use strict';
import { combineResolvers } from 'graphql-resolvers';
import { usersResolver, myProfileResolver, userResolver } from './query';
import {
  signUpResolver,
  signInResolver,
  updateUserResolver,
  deleteUserResolver
} from './mutation';
import { isAuthenticated, isAdmin } from '../../shared/resolvers/authorization';

const userResolvers = {
  Query: {
    users: usersResolver,
    user: userResolver,
    me: myProfileResolver
  },
  Mutation: {
    signUp: signUpResolver,
    signIn: signInResolver,
    updateUser: updateUserResolver,
    deleteUser: combineResolvers(isAuthenticated, isAdmin, deleteUserResolver)
  },
  User: {
    messages: async (user, args, { loaders }) => {
      return (await loaders.userMessage.load(user.id)) || [];
    },
    id: user => {
      return user._id.toString();
    }
  }
};

export default userResolvers;
