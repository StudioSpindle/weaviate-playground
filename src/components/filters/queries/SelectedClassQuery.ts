import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface ISelectedClassData {
  canvas: {
    selectedClass: {
      name: string;
      filters: object;
    };
  };
}

/**
 * Query component
 */
export class SelectedClassQuery extends Query<ISelectedClassData> {}

/**
 * GQL query string
 */
export const SELECTED_CLASS_QUERY = gql`
  query GetSelectedClassForFilters {
    canvas @client {
      selectedClass {
        name
        filters
      }
    }
  }
`;
