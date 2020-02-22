'use strict';
import { createToken } from './jwt';
import { generateUserPasswordHash } from './password';
import { normalizePort } from './normalize';

// check is object id mongodb is valid
const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

const utils = {
  createToken,
  generateUserPasswordHash,
  normalizePort,
  objectIdValid: checkForHexRegExp
};

export default utils;
