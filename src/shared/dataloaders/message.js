'use strict';

export const batchUserMessage = async (keys, models) => {
  const messages = await models.Message.find({
    user: {
      $in: keys
    }
  });
  const dataMap = messages.reduce((acc, obj) => {
    acc[obj.user] = [...(acc[obj.user] || []), obj];
    return acc;
  }, {});
  const batchedMessage = keys.map(key => dataMap[key]);
  return batchedMessage;
};
