import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { NodeLocation, NodeType } from 'src/types';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IUpdateNodesFiltersData {}

export interface IUpdateNodesFiltersVariables {
  nodeLocation?: NodeLocation;
  nodeType?: NodeType;
  queryString?: string;
}

/**
 * Query component
 */
export class UpdateNodesFiltersMutation extends Mutation<
  IUpdateNodesFiltersData,
  IUpdateNodesFiltersVariables
> {}

/**
 * GQL query string
 */
export const UPDATE_NODES_FILTERS = gql`
  mutation UpdateNodesFiltersForLibrary(
    $nodeLocation: String
    $nodeType: String
    $queryString: String
  ) {
    updateNodesFilters(
      nodeLocation: $nodeLocation
      nodeType: $nodeType
      queryString: $queryString
    ) @client
  }
`;
