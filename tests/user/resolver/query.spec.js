import * as api from '../../api';

/**
 * user mutation resolver
 * @list of action:
 * - user(:id)
 * - users
 */

describe('user(id: String!): User', () => {
  it('returns a user when user exist', async () => {
    const expectedResult = {
      data: {
        user: {
          id: '5e4e555cbf31ef2588e22124',
          username: 'awesomeuser',
          role: 'USER'
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

describe('users: [User]', () => {
  it('returns a list of user', async () => {
    const expectedResult = {
      data: {
        users: [
          {
            id: '5e4e555cbf31ef2588e22124',
            username: 'awesomeuser',
            role: 'USER'
          },
          {
            id: '5e4e555cbf31ef2588e22125',
            username: 'arrlancore',
            role: 'ADMIN'
          }
        ]
      }
    };
    const result = await api.users();
    expect(result.data).toEqual(expectedResult);
  });
  it('returns a list of user with messages undefined', async () => {
    const expectedResult = {
      data: {
        users: [
          {
            id: '5e4e555cbf31ef2588e22124',
            username: 'awesomeuser',
            role: 'USER',
            message: undefined
          },
          {
            id: '5e4e555cbf31ef2588e22125',
            username: 'arrlancore',
            role: 'ADMIN',
            message: undefined
          }
        ]
      }
    };
    const result = await api.users();
    expect(result.data).toEqual(expectedResult);
  });
});
