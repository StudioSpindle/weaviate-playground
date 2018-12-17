import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';
import { ClassLocation, ClassType } from 'src/types';

/**
 * Types
 */
interface ILibraryClassButtonData {
  class: {
    id: ClassId;
    instance: string;
    isSelected: boolean;
    name: string;
    classLocation: ClassLocation;
    classType: ClassType;
  };
  classesFilters: {
    classLocation: ClassLocation;
    classType: ClassType;
    queryString: string;
  };
}

interface ILibaryClassButtonVariables {
  id: ClassId;
}

/**
 * Query component
 */
export class LibraryClassButtonQuery extends Query<
  ILibraryClassButtonData,
  ILibaryClassButtonVariables
> {}

/**
 * GQL query string
 */
export const LIBRARY_CLASS_BUTTON_QUERY = gql`
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
