'use strict';

import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages(
      offset: Int
      limit: Int
      cursor: String
      orderBy: String
    ): MessageConnection!
    message(id: ID!): Message!
  }
  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(input: MessageInput!): Message!
  }
  extend type Subscription {
    messageCreated: MessageCreated!
  }

  input MessageInput {
    text: String!
    id: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PageInfo {
    """
    end cursor is reffered to createdAt (date) with hash base64
    """
    endCursor: String!
    hasNextPage: Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type MessageCreated {
    message: Message!
  }
`;
