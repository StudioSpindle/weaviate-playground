import gql from 'graphql-tag';

export const GET_NODES = gql`
  query GetNodesForLibrary(
    $isSelected: Boolean
    $nodeLocation: String!
    $nodeType: String
  ) {
    nodes(
      isSelected: $isSelected
      nodeLocation: $nodeLocation
      nodeType: $nodeType
    ) @client {
      name
      nodeType
      isSelected
    }
  }
`;
