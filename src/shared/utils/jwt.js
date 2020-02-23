'use strict';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export const createToken = async (user, secret, expiresTime) => {
  const { id, email, username, role } = user;
  const tokenExpireTime = expiresTime || '30m';
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn: tokenExpireTime
  });
};

export const getUserByToken = async headers => {
  const token = headers['x-token'];
  if (token) {
    try {
      const user = await jwt.verify(token, process.env.SECRET);
      return user;
    } catch (e) {
      throw new AuthenticationError(
        'Your session is not valid. Sign in again.'
      );
    }
  }
};
