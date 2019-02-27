import gql from 'graphql-tag';

/**
 * GQL query string
 */
export const UPDATE_QUERY_MUTATION = gql`
  mutation updateQueryMutation(
    $hasActiveSourceLinks: Boolean!
    $hasActiveTargetLinks: Boolean!
    $queryString: String!
  ) {
    updateQueryString(
      hasActiveSourceLinks: $hasActiveSourceLinks
      hasActiveTargetLinks: $hasActiveTargetLinks
      queryString: $queryString
    ) @client
  }
`;
