import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGetSelectedClassData {
  canvas: {
    selectedClass: {
      name: string;
    };
  };
}

/**
 * Query component
 */
export class GetSelectedClassQuery extends Query<IGetSelectedClassData> {}

/**
 * GQL query string
 */
export const GET_SELECTED_CLASS = gql`
  query GetSelectedClassForFilters {
    canvas @client {
      selectedClass {
        name
      }
    }
  }
`;
