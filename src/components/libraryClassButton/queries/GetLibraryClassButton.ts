import gql from 'graphql-tag';

// TODO: add types and query component

/**
 * GQL query string
 */
export const GET_LIBRARY_CLASS_BUTTON_QUERY = gql`
  query GetLibraryClassButton($id: String!) {
    class(id: $id) @client {
      id
      instance
      isSelected
      name
      classLocation
      classType
    }
    classesFilters @client {
      classLocation
      classType
      queryString
    }
  }
`;
