import * as api from './api';

describe('user(id: String!): User', () => {
  it('returns a user when user can be found', async () => {
    const expectedResult = {
      data: {
        user: {
          id: '5e4e555cbf31ef2588e22124',
          username: 'awesomeuser'
        }
      }
    };
    const result = await api.user({ id: '5e4e555cbf31ef2588e22124' });
    expect(result.data).toEqual(expectedResult);
    expect(result.data).toMatchSnapshot();
  });

  it('returns null when user cannot be found', async () => {
    const expectedResult = {
      data: {
        user: null
      }
    };
    const result = await api.user({ id: '3e4e555cbf31ef2588e22124' });
    expect(result.data).toEqual(expectedResult);
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
