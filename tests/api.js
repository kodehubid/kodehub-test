import axios from 'axios';
const API_URL = 'http://localhost:8080/graphql';

export const user = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          role
          username
        }
      }
    `,
    variables
  });

export const users = async () =>
  axios.post(API_URL, {
    query: `
      query {
        users {
          id
          role
          username
        }
      }
    `
  });

export const signIn = async variables =>
  await axios.post(API_URL, {
    query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
    variables
  });

export const deleteUser = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables
    },
    {
      headers: {
        'x-token': token
      }
    }
  );
