import gql from 'graphql-tag';

export const GET_NODES_FILTERS = gql`
  query GetNodesFiltersForLibrary {
    nodesFilters @client {
      nodeLocation
      nodeType
    }
  }
`;

export const UPDATE_NODES_FILTERS = gql`
  mutation GetNodesFiltersForLibrary($nodeLocation: String, $nodeType: String) {
    updateNodesFilters(nodeLocation: $nodeLocation, nodeType: $nodeType) @client
  }
`;
