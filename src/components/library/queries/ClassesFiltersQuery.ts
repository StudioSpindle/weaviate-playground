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
export class ClassesFiltersQuery extends Query<
  IGetClassesFiltersData,
  IGetClassesFiltersVariables
> {}

/**
 * GQL query string
 */
export const CLASSES_FILTERS_QUERY = gql`
  query GetClassesFiltersForLibrary {
    classesFilters @client {
      classLocation
      classType
      queryString
    }
  }
`;
