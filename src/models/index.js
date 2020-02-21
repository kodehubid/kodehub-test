'use strict';

import mongoose from 'mongoose';
import User from './user';
import Message from './message';

const connectDb = () => {
  const isTest = process.env.TEST_DB;
  const DB_URL = isTest
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

  mongoose.set('useFindAndModify', false);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('debug', true);
  mongoose.set('useCreateIndex', true);
  return mongoose.connect(DB_URL);
};

const models = { User, Message };

export { connectDb };
export default models;
