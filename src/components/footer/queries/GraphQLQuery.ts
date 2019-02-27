import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGraphQLQueryData {
  canvas: {
    queryString: string;
  };
}

/**
 * Query component
 */
export class GraphQLQueryQuery extends Query<IGraphQLQueryData> {}

/**
 * GQL query string
 */
export const GRAPHQL_QUERY_QUERY = gql`
  query graphQLQueryQuery {
    canvas @client {
      queryString
    }
  }
`;
