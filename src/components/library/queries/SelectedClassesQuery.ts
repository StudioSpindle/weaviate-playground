import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface ISelectedClassesData {
  canvas: {
    selectedClasses: string[];
  };
}

/**
 * Query component
 */
export class SelectedClassesQuery extends Query<ISelectedClassesData> {}

/**
 * GQL query string
 */
export const SELECTED_CLASSES_QUERY = gql`
  query GetSelectedClasses {
    canvas @client {
      selectedClasses
    }
  }
`;
