import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NodeType } from 'src/types';

/**
 * Types
 */
interface IGetNetworkNodesData {
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
          name: NodeType;
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

interface IGetNodesVariables {
  typename: 'WeaviateNetworkGetObj';
}

/**
 * Query component
 */
export class GetNetworkNodesQuery extends Query<
  IGetNetworkNodesData,
  IGetNodesVariables
> {}

/**
 * GQL query string
 */
export const GET_NETWORK_NODES = gql`
  query GetLocalNodes($typename: String!) {
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
