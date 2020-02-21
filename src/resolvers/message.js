'use strict';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';
const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (
      parent,
      { limit = 25, offset = 0, orderBy = '-createdAt', cursor },
      { models }
    ) => {
      const cursorOptions = cursor
        ? {
          createdAt: { $lt: fromCursorHash(cursor) }
        }
        : {};
      const findOptions = { limit: limit + 1, sort: orderBy };
      if (offset) {
        findOptions.skip = offset;
      }

      const messages = await models.Message.find(
        { ...cursorOptions },
        null,
        findOptions
      ).populate('user');
      const messagesLength = messages.length;
      const hasNextPage = messagesLength > limit;

      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      const endCursor = edges[edges.length - 1]?.createdAt || 0;

      const pageInfo = {
        hasNextPage,
        endCursor: toCursorHash(String(endCursor))
      };

      return { edges, pageInfo };
    },
    message: async (parent, { id }, { models }) => {
      const message = await models.Message.findById(id).populate('user');
      return message;
    }
  },
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, me }) => {
        const message = await models.Message.create({ text, user: me.id });
        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message }
        });
        return message;
      }
    ),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      (parent, { id }, { models }) => {
        return models.Message.deleteOne({ _id: id });
      }
    ),
    updateMessage: (parent, { text, id }, { models }) => {
      return models.Message.findOneAndUpdate({ _id: id }, { text });
    }
  },
  MessageConnection: {
    totalCount: (parent, args, { models }) => {
      return models.Message.countDocuments();
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED)
    }
  }
};
