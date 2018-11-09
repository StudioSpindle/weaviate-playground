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
  value?: string | boolean | object;
}

/**
 * Query component
 */
export class ToggleSwitchMutation extends Mutation<
  IFilterToggleSwitchData,
  IFilterToggleSwitchVariables
> {}

/**
 * GQL query string
 */
export const TOGGLE_SWITCH_MUTATION = gql`
  mutation ToggleSwitch(
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
