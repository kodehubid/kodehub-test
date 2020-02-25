'use strict';
import { combineResolvers } from 'graphql-resolvers';
import { messagesResolver, messageResolver } from './query';
import { messageCreatedResolver } from './subscription';
import {
  createMessageResolver,
  deleteMessageResolver,
  updateMessageResolver
} from './mutation';
import {
  isAuthenticated,
  isMessageOwner
} from '../../shared/resolvers/authorization';
import utils from '../../shared/utils';

const messageResolvers = {
  Query: {
    messages: combineResolvers(isAuthenticated, messagesResolver),
    message: combineResolvers(isAuthenticated, messageResolver)
  },
  Mutation: {
    createMessage: combineResolvers(isAuthenticated, createMessageResolver),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      deleteMessageResolver
    ),
    updateMessage: combineResolvers(isAuthenticated, updateMessageResolver)
  },
  Subscription: {
    messageCreated: combineResolvers(isAuthenticated, messageCreatedResolver)
  },
  MessageConnection: {
    totalCount: (parent, args, { models }) => {
      return models.Message.countDocuments();
    }
  },
  Message: {
    id: message => {
      return message._id.toString();
    },
    user: async (message, args, { models }) => {
      const isObjectId = utils.objectIdValid.test(message.user);
      return isObjectId
        ? await models.User.findById(message.user)
        : message.user;
    }
  }
};

export default messageResolvers;
