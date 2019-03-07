import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IFilterToggleSwitchData {}

export interface IFilterToggleSwitchVariables {
  classId: string;
  filterName: string;
  filterType: string;
  path?: string[];
  value?: string | boolean | object;
}

/**
 * Query component
 */
export class FilterToggleSwitchMutation extends Mutation<
  IFilterToggleSwitchData,
  IFilterToggleSwitchVariables
> {}

/**
 * GQL query string
 */
export const FILTER_TOGGLE_SWITCH_MUTATION = gql`
  mutation FilterToggleSwitch(
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
