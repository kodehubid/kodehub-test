export default async function createUsers(models) {
  const user1 = new models.User({
    username: 'awesomeuser',
    createdAt: Date.now(),
    email: 'user@awesomeuser.com',
    password: 'Password@123',
    _id: '5e4e555cbf31ef2588e22124',
    role: 'USER'
  });
  const user2 = new models.User({
    username: 'awesomeadmin',
    createdAt: Date.now(),
    email: 'admin@awesomeuser.com',
    password: 'Password@123',
    _id: '5e4e555cbf31ef2588e22125',
    role: 'ADMIN'
  });

  await user1.save();
  await user2.save();
  console.log('DATA SEEDED');
}
