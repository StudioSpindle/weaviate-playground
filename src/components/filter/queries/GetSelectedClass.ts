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
export class GetSelectedClassForFilterQuery extends Query<
  IGetSelectedClassForFilterData
> {}

/**
 * GQL query string
 */
export const GET_SELECTED_CLASS_FOR_FILTER = gql`
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
