import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IToggleFilterTextSearchButtonData {}

export interface IToggleFilterTextSearchButtonVariables {
  classId: string;
  filterName: string;
  filterType: string;
  value: string | boolean | object;
}

/**
 * Query component
 */
export class ToggleFilterTextSearchButtonMutation extends Mutation<
  IToggleFilterTextSearchButtonData,
  IToggleFilterTextSearchButtonVariables
> {}

/**
 * GQL query string
 */
export const TOGGLE_FILTER_TEXT_SEARCH_MUTATION = gql`
  mutation ToggleFilterTextSearch(
    $classId: String!
    $filterName: String!
    $filterType: String!
    $value: String!
  ) {
    updateClassFilters(
      classId: $classId
      filterName: $filterName
      filterType: $filterType
      value: $value
    ) @client
  }
`;
