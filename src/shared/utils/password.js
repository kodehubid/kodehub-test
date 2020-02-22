'use strict';
import bcrypt from 'bcrypt';

export async function generateUserPasswordHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
