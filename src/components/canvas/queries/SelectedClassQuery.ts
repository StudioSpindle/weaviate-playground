import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from '../Canvas';

/**
 * Types
 */
interface ISelectedClassData {
  canvas: {
    selectedClass: {
      id: ClassId;
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
  query GetSelectedClassForCanvas {
    canvas @client {
      selectedClass {
        id
      }
    }
  }
`;
