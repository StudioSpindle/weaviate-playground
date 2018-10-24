import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGetSelectedNodeData {
  canvas: {
    selectedNode: string;
  };
}

/**
 * Query component
 */
export class GetSelectedNodeQuery extends Query<IGetSelectedNodeData> {}

/**
 * GQL query string
 */
export const GET_SELECTED_NODE = gql`
  query GetSelectedNodeForFilters {
    canvas @client {
      selectedNode
    }
  }
`;
