import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGetSelectedClassForFilterData {
  canvas: {
    selectedClass: {
      id: string;
      classLocation: string;
      classType: string;
      instance: string;
      name: string;
    };
  };
}

/**
 * Query component
 */
export class SelectedClassForFilterQuery extends Query<
  IGetSelectedClassForFilterData
> {}

/**
 * GQL query string
 */
export const SELECTED_CLASS_FOR_FILTER_QUERY = gql`
  query GetSelectedClassForFilter {
    canvas @client {
      selectedClass {
        id
        classLocation
        classType
        instance
        name
      }
    }
  }
`;
