import { UserInputError, AuthenticationError } from 'apollo-server';
import passwordValidator from 'password-validator';

const passwordSchema = new passwordValidator()
  .is()
  .min(8)
  .is()
  .max(40)
  .has()
  .letters()
  .has()
  .uppercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(['Passw0rd123', 'Passw0rd', 'Password123']);

export const validateFieldPassword = password => {
  const passwordError = passwordSchema.validate(password, { list: true });
  if (passwordError.includes('uppercase')) {
    throw new UserInputError('Password must contain an uppercase character');
  }
  if (passwordError.includes('digits')) {
    throw new UserInputError('Password must contain a digit');
  }
  if (passwordError.includes('letters')) {
    throw new UserInputError('Password must contain a letter');
  }
  if (passwordError.includes('min') || passwordError.includes('max')) {
    throw new UserInputError('Password length should be have 6-40 characters');
  }
  if (passwordError.includes('spaces')) {
    throw new UserInputError('Password cannot contain spaces');
  }
  if (passwordError.includes('oneOf')) {
    throw new UserInputError('Password is too common and cannot be used');
  }
};

export const validateSignIn = async (user, password) => {
  if (!user) {
    throw new UserInputError('No user found with this login credentials.');
  }
  const isValid = await user.validatePassword(password);
  if (!isValid) {
    throw new AuthenticationError('Invalid user login or password.');
  }
};

export const validateSignInInput = async (login, password) => {
  if (!login) {
    console.log('TCL: validateSignInInput -> login', login);
    throw new UserInputError('Login is required');
  }
  if (!password) {
    throw new UserInputError('Password is required');
  }
  if (login.length > 20) {
    throw new UserInputError('Invalid login');
  }
  if (login.length > 40) {
    throw new UserInputError('Invalid password.');
  }
};
