import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassType } from 'src/types';

/**
 * Types
 */
export interface IGetPossibleTypesData {
  __type: {
    fields: Array<{
      name: ClassType;
      type: {
        ofType: {
          possibleTypes: Array<{
            name: string;
          }>;
        };
      };
    }>;
  };
}

export interface IGetPossibleTypesVariables {
  typename: string;
}

/**
 * Query component
 */
export class PossibleTypesQuery extends Query<
  IGetPossibleTypesData,
  IGetPossibleTypesVariables
> {}

/**
 * GQL query string
 */
export const POSSIBLE_TYPES_QUERY = gql`
  query GetLocalClasses($typename: String!) {
    __type(name: $typename) {
      fields {
        name
        type {
          ofType {
            possibleTypes {
              name
            }
          }
        }
      }
    }
  }
`;
