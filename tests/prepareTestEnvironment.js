import createUsersWithMessages from './seeds/001_testUserMessage';

export default async function(models) {
  // clear db
  await Promise.all([
    models.User.deleteMany({}),
    models.Message.deleteMany({})
  ]);
  // seed data
  await createUsersWithMessages(models);
}
