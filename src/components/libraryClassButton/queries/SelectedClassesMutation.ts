import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface ISelectedClassesData {}

export interface ISelectedClassesVariables {
  id: string;
}

/**
 * Query component
 */
export class SelectedClassesMutation extends Mutation<
  ISelectedClassesData,
  ISelectedClassesVariables
> {}

/**
 * GQL query string
 */
export const SELECTED_CLASSES_MUTATION = gql`
  mutation SelectedClasses($id: String) {
    updateSelectedClasses(id: $id) @client
    toggleClassSelectionLibrary(id: $id) @client
  }
`;
