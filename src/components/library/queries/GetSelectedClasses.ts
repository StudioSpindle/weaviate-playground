import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGetSelectedClassesData {
  canvas: {
    selectedClasses: string[];
  };
}

/**
 * Query component
 */
export class GetSelectedClassesQuery extends Query<IGetSelectedClassesData> {}

/**
 * GQL query string
 */
export const GET_SELECTED_CLASSES = gql`
  query GetSelectedClasses {
    canvas @client {
      selectedClasses
    }
  }
`;
