import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassType } from 'src/types';

/**
 * Types
 */
interface IGetNetworkClassesData {
  __type: {
    name: string;
    fields: Array<{
      name: string;
      type: {
        name: string;
        ofType: {
          name: string;
        };
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
    }>;
  };
}

interface IGetClassesVariables {
  typename: 'WeaviateNetworkGetObj';
}

/**
 * Query component
 */
export class GetNetworkClassesQuery extends Query<
  IGetNetworkClassesData,
  IGetClassesVariables
> {}

/**
 * GQL query string
 */
export const GET_NETWORK_CLASSES = gql`
  query GetNetworkClasses($typename: String!) {
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
    }
  }
`;
