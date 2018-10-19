import gql from 'graphql-tag';

// TODO: add types and query component

/**
 * GQL query string
 */
export const GET_LIBRARY_NODE_BUTTON_QUERY = gql`
  query GetLibraryNodeButton($typename: String!) {
    __type(name: $typename) {
      name
      __typename
    }
    canvas @client {
      selectedNodes
    }
  }
`;
