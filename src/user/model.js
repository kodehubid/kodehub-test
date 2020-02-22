'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 6,
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    maxlength: 50
  },
  role: {
    type: String,
    required: true,
    default: 'USER'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.statics.findByLogin = async function(login) {
  let user = await this.findOne({
    username: login
  });
  if (!user) {
    user = await this.findOne({ email: login });
  }
  return user;
};

/* Authenticate method to compare the passed password
 *
 * @param password
 */
userSchema.methods.validatePassword = async function validatePassword(
  password
) {
  const isValidated = await bcrypt.compare(password, this.password);
  return isValidated;
};

userSchema.pre('save', async function saveUser(next) {
  // set hash for password
  if (this.isModified('password')) {
    this.password = await generateUserPasswordHash(this.password);
  }

  next();
});

userSchema.pre('findById', async function saveUser(next) {
  // set hash for password
  console.log('post find by id');

  next();
});

userSchema.pre('remove', function(next) {
  this.model('Message').deleteMany({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);
export default User;

// some helper
export async function generateUserPasswordHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
