import gql from 'graphql-tag';

/**
 * GQL query string
 */
export const UPDATE_CLASS_MUTATION = gql`
  mutation updateClass(
    $id: String!
    $instance: String!
    $name: String!
    $classLocation: String!
    $classType: String!
  ) {
    updateClass(
      id: $id
      instance: $instance
      name: $name
      classLocation: $classLocation
      classType: $classType
    ) @client
  }
`;
