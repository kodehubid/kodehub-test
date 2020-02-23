import pubsub, { EVENTS } from '../../shared/subscriptions';

export const createMessageResolver = async (
  parent,
  { text },
  { models, user }
) => {
  const message = await models.Message.create({ text, user: user.id });
  pubsub.publish(EVENTS.MESSAGE.CREATED, {
    messageCreated: { message }
  });

  return message;
};

export const deleteMessageResolver = (parent, { id }, { models }) => {
  return models.Message.deleteOne({ _id: id });
};

export const updateMessageResolver = (parent, { text, id }, { models }) => {
  return models.Message.findOneAndUpdate({ _id: id }, { text });
};
