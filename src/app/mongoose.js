import mongoose from 'mongoose';
import models from './models';
import configs from './configs';
import createUsersWithMessages from '../../seeds/001_testUserMessage';

const isTest = process.env.NODE_ENV === 'test';
const DB_URL = isTest
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

const connectToDatabase = () => {
  mongoose.set('useFindAndModify', false);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useCreateIndex', true);
  mongoose.set('debug', configs.mongodb.debug);

  isTest && makeTestEnvironment();

  return mongoose.connect(DB_URL);
};

const makeTestEnvironment = async () => {
  console.info('Prepare database for testing');
  // clear db
  await Promise.all([
    models.User.deleteMany({}),
    models.Message.deleteMany({})
  ]);
  // seed data
  await createUsersWithMessages(models);
};

export default connectToDatabase;
