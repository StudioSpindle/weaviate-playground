import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ClassLocation, ClassType } from 'src/types';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IUpdateClassesFiltersData {}

export interface IUpdateClassesFiltersVariables {
  classLocation?: ClassLocation;
  classType?: ClassType;
  queryString?: string;
}

/**
 * Query component
 */
export class UpdateClassesFiltersMutation extends Mutation<
  IUpdateClassesFiltersData,
  IUpdateClassesFiltersVariables
> {}

/**
 * GQL query string
 */
export const UPDATE_CLASSES_FILTERS = gql`
  mutation UpdateClassesFiltersForLibrary(
    $classLocation: String
    $classType: String
    $queryString: String
  ) {
    updateClassesFilters(
      classLocation: $classLocation
      classType: $classType
      queryString: $queryString
    ) @client
  }
`;
