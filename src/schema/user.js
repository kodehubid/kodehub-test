'use strict';

import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    users: [User!]!
    user(id: ID): User
    me: User
  }
  extend type Mutation {
    signUp(input: UserCreateInput!): Token!
    signIn(login: String!, password: String!): Token!
    updateUser(input: UserUpdateInput!): User!
    deleteUser(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: EmailAddress!
    role: String!
    """
    the list of message by this user
    """
    messages: [Message!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type Token {
    token: String!
  }

  input UserCreateInput {
    username: String!
    email: EmailAddress!
    password: String!
  }
  input UserUpdateInput {
    id: ID!
    username: String
    email: EmailAddress
    password: String
    role: UserRoles
  }

  enum UserRoles{
    ADMIN
    USER
  }
`;
