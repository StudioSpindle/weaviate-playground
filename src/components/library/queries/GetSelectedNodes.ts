import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGetSelectedNodesData {
  canvas: {
    selectedNodes: string[];
  };
}

/**
 * Query component
 */
export class GetSelectedNodesQuery extends Query<IGetSelectedNodesData> {}

/**
 * GQL query string
 */
export const GET_SELECTED_NODES = gql`
  query GetSelectedNodes {
    canvas @client {
      selectedNodes
    }
  }
`;
