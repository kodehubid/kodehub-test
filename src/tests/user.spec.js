import { expect } from 'chai';
import * as api from './api';

describe('users query', () => {
  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '5e4e555cbf31ef2588e22124',
            username: 'rwieruch'
          },
        },
      };
      const result = await api.user({ id: '5e4e555cbf31ef2588e22124' });
      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };
      const result = await api.user({ id: '3e4e555cbf31ef2588e22124' });
      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('returns an error because only admins can delete a user', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await api.signIn({
        login: 'rwieruch',
        password: 'password123',
      });
      const {
        data: { errors },
      } = await api.deleteUser({ id: '3e4e555cbf31ef2588e22124' }, token);
      expect(errors[0].message).to.eql('Not authorized as admin.');
    });
  });
});