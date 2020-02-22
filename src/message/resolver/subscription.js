import pubsub, { EVENTS } from '../../shared/subscriptions';

export const messageCreatedResolver = {
  subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED)
};
