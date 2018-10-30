import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassLocation, ClassType } from 'src/types';

/**
 * Types
 */
interface IGetClassesFiltersData {
  classesFilters: {
    classLocation: ClassLocation;
    classType: ClassType;
    queryString: string;
  };
}

interface IGetClassesFiltersVariables {
  typename: string;
}

/**
 * Query component
 */
export class GetClassesFiltersQuery extends Query<
  IGetClassesFiltersData,
  IGetClassesFiltersVariables
> {}

/**
 * GQL query string
 */
export const GET_CLASSES_FILTERS = gql`
  query GetClassesFiltersForLibrary {
    classesFilters @client {
      classLocation
      classType
      queryString
    }
  }
`;
