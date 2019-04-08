import gql from 'graphql-tag';

/**
 * GQL query string
 */
export const UPDATE_META_COUNT_MUTATION = gql`
  mutation updateMetaCount($className: String!, $addition: Boolean!) {
    updateMetaCount(className: $className, addition: $addition) @client
  }
`;
