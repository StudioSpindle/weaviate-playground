import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IUpdateSelectedClassesData {}

export interface IUpdateSelectedClassesVariables {
  id: string;
}

/**
 * Query component
 */
export class UpdateSelectedClassesMutation extends Mutation<
  IUpdateSelectedClassesData,
  IUpdateSelectedClassesVariables
> {}

/**
 * GQL query string
 */
export const UPDATE_SELECTED_CLASSES = gql`
  mutation UpdateSelectedClasses($id: String) {
    updateSelectedClasses(id: $id) @client
    toggleClassSelectionLibrary(id: $id) @client
  }
`;
