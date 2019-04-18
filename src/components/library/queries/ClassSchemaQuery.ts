import gql from 'graphql-tag';

// TODO: Remove RESTful request when integrated in GraphQL
export const CLASS_SCHEMA_QUERY = gql`
  query classSchemas {
    classSchemas @rest(type: "ClassSchemas", path: "meta") {
      actionsSchema
      thingsSchema
    }
  }
`;
