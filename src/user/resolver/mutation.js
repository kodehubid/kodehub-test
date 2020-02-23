import {
  validateSignIn,
  validateSignInInput,
  validateFieldPassword
} from '../validator';
import utils from '../../shared/utils';

export const signUpResolver = async (parent, { input }, { models, secret }) => {
  await validateFieldPassword(input.password);
  const user = await models.User.create(input);
  return { token: utils.createToken(user, secret) };
};

export const signInResolver = async (
  parent,
  { login, password },
  { models, secret }
) => {
  await validateSignInInput(login, password);
  const user = await models.User.findByLogin(login);
  await validateSignIn(user, password);
  return { token: utils.createToken(user, secret) };
};

export const updateUserResolver = async (parent, { input }, { models }) => {
  const { id, ...rest } = input;
  const updates = rest;
  if (updates.password) {
    updates.password = await utils.generateUserPasswordHash(rest.password);
  }
  return models.User.findOneAndUpdate({ _id: id }, updates);
};

export const deleteUserResolver = async (parent, { id }, { models }) => {
  let hasDeleted = false;
  const deleteStatus = await models.User.deleteOne({ _id: id });
  if (deleteStatus) {
    hasDeleted = true;
  }
  return hasDeleted;
};
