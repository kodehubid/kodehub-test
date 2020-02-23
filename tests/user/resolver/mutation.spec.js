import * as api from '../../api';

/**
 * user mutation resolver
 * @list of action:
 * - signIn
 * - deleteUser
 */

describe('signIn(login: String!, password: String!): String!', () => {
  it('returns a token when signIn success', async () => {
    const {
      data: {
        data: {
          signIn: { token }
        }
      }
    } = await api.signIn({
      login: 'awesomeuser',
      password: 'password123'
    });

    expect(typeof token).toEqual('string');
  });

  it('returns an error when login with unregistered user login', async () => {
    const result = await api.signIn({
      login: 'nouser',
      password: 'password12345'
    });
    const error = result.data.errors[0].message;

    expect(error).toEqual('No user found with this login credentials.');
  });

  it('returns an error when login with wrong password', async () => {
    const result = await api.signIn({
      login: 'awesomeuser',
      password: 'passwordIsWrong'
    });
    const error = result.data.errors[0].message;

    expect(error).toEqual('Invalid password.');
  });
});

describe('deleteUser(id: String!): Boolean!', () => {
  it('returns an error because only admins can delete a user', async () => {
    const {
      data: {
        data: {
          signIn: { token }
        }
      }
    } = await api.signIn({
      login: 'awesomeuser',
      password: 'password123'
    });

    const {
      data: { errors }
    } = await api.deleteUser({ id: '3e4e555cbf31ef2588e22124' }, token);
    expect(errors[0].message).toEqual('Not authorized as admin.');
  });
});
