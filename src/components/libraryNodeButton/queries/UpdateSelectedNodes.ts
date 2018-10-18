import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IUpdateSelectedNodesData {}

export interface IUpdateSelectedNodesVariables {
  typename: string;
}

/**
 * Query component
 */
export class UpdateSelectedNodesMutation extends Mutation<
  IUpdateSelectedNodesData,
  IUpdateSelectedNodesVariables
> {}

/**
 * GQL query string
 */
export const UPDATE_SELECTED_NODES = gql`
  mutation UpdateSelectedNodes($typename: String) {
    updateSelectedNodes(typename: $typename) @client
  }
`;
