export const usersResolver = (parent, args, { models }) => {
  return models.User.find();
};

export const userResolver = (parent, { id }, { models }) => {
  return models.User.findById(id);
};

export const myProfileResolver = (parent, args, { user, models }) => {
  if (!user) {
    return null;
  }
  return models.User.findById(user.id);
};
