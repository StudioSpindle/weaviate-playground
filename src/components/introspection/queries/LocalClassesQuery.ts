import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassType } from 'src/types';

/**
 * Types
 */
interface IGetLocalClassesData {
  __type: {
    name: string;
    fields: Array<{
      name: ClassType;
      type: {
        name: string;
        ofType: {
          name: string;
        };
        fields: Array<{
          name: string;
          type: {
            ofType: {
              name: string;
            };
          };
        }>;
      };
    }>;
  };
}

interface IGetLocalClassesVariables {
  typename: 'GetObj';
}

/**
 * Query component
 */
export class LocalClassesQuery extends Query<
  IGetLocalClassesData,
  IGetLocalClassesVariables
> {}

/**
 * GQL query string
 */
export const LOCAL_CLASSES_QUERY = gql`
  query GetLocalClasses($typename: String!) {
    __type(name: $typename) {
      name
      fields {
        name
        type {
          name
          ofType {
            name
          }
          fields {
            name
            type {
              ofType {
                name
              }
            }
          }
        }
      }
    }
  }
`;
