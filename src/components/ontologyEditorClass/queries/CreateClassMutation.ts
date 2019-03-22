import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Keywords } from 'src/types';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
interface ICreateClassData {}

interface ICreateClassVariables {
  classType: string;
  body: {
    class: string;
    description: string;
    keywords: Keywords;
  };
}

/**
 * Query component
 */
export class CreateClassMutation extends Mutation<
  ICreateClassData,
  ICreateClassVariables
> {}

/**
 * GQL query string
 */
export const CREATE_CLASS_MUTATION = gql`
  mutation createClass($classType: String!, $body: Body!) {
    saveClass(classType: $classType, body: $body)
      @rest(
        type: "Class"
        path: "schema/{args.classType}"
        method: "POST"
        bodyKey: "body"
      ) {
      NoResponse
    }
  }
`;
