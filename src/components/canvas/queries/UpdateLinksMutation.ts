import gql from 'graphql-tag';

/**
 * GQL query string
 */
export const UPDATE_LINKS_MUTATION = gql`
  mutation updateLinks($links: [Link]!) {
    updateLinks(links: $links) @client
  }
`;
