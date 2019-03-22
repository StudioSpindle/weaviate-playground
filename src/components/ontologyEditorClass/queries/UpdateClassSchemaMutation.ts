import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Keywords } from 'src/types';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
interface IUpdateClassSchemaData {}

interface IUpdateClassSchemaVariables {
  className: string;
  classType: string;
  body: {
    newName: string;
    keywords: Keywords;
  };
}

/**
 * Query component
 */
export class UpdateClassSchemaMutation extends Mutation<
  IUpdateClassSchemaData,
  IUpdateClassSchemaVariables
> {}

/**
 * GQL query string
 */
export const UPDATE_CLASS_SCHEMA_MUTATION = gql`
  mutation updateClassSchema(
    $className: String!
    $classType: String!
    $body: Body!
  ) {
    updateClassSchema(
      className: $className
      classType: $classType
      body: $body
    )
      @rest(
        type: "Class"
        path: "schema/{args.classType}/{args.className}"
        method: "PUT"
        bodyKey: "body"
      ) {
      NoResponse
    }
  }
`;
