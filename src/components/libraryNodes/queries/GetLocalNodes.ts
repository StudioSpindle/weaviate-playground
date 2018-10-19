import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { NodeType } from 'src/types';

/**
 * Types
 */
interface IGetLocalNodesData {
  __type: {
    name: string;
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
}

interface IGetLocalNodesVariables {
  typename: 'WeaviateLocalGetObj';
}

/**
 * Query component
 */
export class GetLocalNodesQuery extends Query<
  IGetLocalNodesData,
  IGetLocalNodesVariables
> {}

/**
 * GQL query string
 */
export const GET_LOCAL_NODES = gql`
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
