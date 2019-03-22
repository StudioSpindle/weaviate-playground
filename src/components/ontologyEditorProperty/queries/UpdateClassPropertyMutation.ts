import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Keywords } from 'src/types';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
interface IUpdateClassPropertyData {}

interface IUpdateClassPropertyVariables {
  className: string;
  classType: string;
  body: {
    newName: string;
    keywords: Keywords;
  };
  propertyName: string;
}

/**
 * Query component
 */
export class UpdateClassPropertyMutation extends Mutation<
  IUpdateClassPropertyData,
  IUpdateClassPropertyVariables
> {}

/**
 * GQL query string
 */
export const UPDATE_CLASS_PROPERTY_MUTATION = gql`
  mutation updateClassProperty(
    $className: String!
    $classType: String!
    $body: Body!
    $propertyName: String!
  ) {
    updateClassProperty(
      className: $className
      classType: $classType
      body: $body
      propertyName: $propertyName
    )
      @rest(
        type: "Class"
        path: "schema/{args.classType}/{args.className}/properties/{args.propertyName}"
        method: "PUT"
        bodyKey: "body"
      ) {
      NoResponse
    }
  }
`;
