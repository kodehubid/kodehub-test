import { UserInputError, AuthenticationError } from 'apollo-server';

export const validateSignIn = async (user, password) => {
  if (!user) {
    throw new UserInputError('No user found with this login credentials.');
  }
  const isValid = await user.validatePassword(password);
  if (!isValid) {
    throw new AuthenticationError('Invalid password.');
  }
};
