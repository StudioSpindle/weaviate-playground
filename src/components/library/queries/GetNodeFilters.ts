import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NodeLocation, NodeType } from 'src/types';

/**
 * Types
 */
interface IGetNodesFiltersData {
  nodesFilters: {
    nodeLocation: NodeLocation;
    nodeType: NodeType;
    queryString: string;
  };
}

interface IGetNodesFiltersVariables {
  typename: string;
}

/**
 * Query component
 */
export class GetNodesFiltersQuery extends Query<
  IGetNodesFiltersData,
  IGetNodesFiltersVariables
> {}

/**
 * GQL query string
 */
export const GET_NODES_FILTERS = gql`
  query GetNodesFiltersForLibrary {
    nodesFilters @client {
      nodeLocation
      nodeType
      queryString
    }
  }
`;
