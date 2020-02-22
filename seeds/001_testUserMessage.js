export default async function createUsersWithMessages(models) {
  const user1 = new models.User({
    username: 'awesomeuser',
    createdAt: Date.now(),
    email: 'rwi@awesomeuser.com',
    password: 'password123',
    _id: '5e4e555cbf31ef2588e22124',
    role: 'USER'
  });
  const user2 = new models.User({
    username: 'arrlancore',
    createdAt: Date.now(),
    email: 'ar@awesomeuser.com',
    password: 'password123',
    _id: '5e4e555cbf31ef2588e22125',
    role: 'ADMIN'
  });
  const message1 = new models.Message({
    text: 'What a beuty test',
    user: user1.id,
    createdAt: Date.now(),
    _id: '5e4e555cbf31ef2588e22126'
  });
  const message2 = new models.Message({
    text: 'Ready for production',
    user: user2.id,
    createdAt: Date.now(),
    _id: '5e4e555cbf31ef2588e22127'
  });
  const message3 = new models.Message({
    text: 'Good Jobs',
    user: user2.id,
    createdAt: Date.now(),
    _id: '5e4e555cbf31ef2588e22128'
  });
  await message1.save();
  await message2.save();
  await message3.save();
  await user1.save();
  await user2.save();
  console.log('DATA SEEDED');
}
