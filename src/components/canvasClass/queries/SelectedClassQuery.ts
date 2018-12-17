import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';
import { ClassType } from 'src/types';

/**
 * Types
 */
interface ISelectedClassData {
  class: {
    classType: ClassType;
    isSelected: boolean;
    name: string;
  };
  canvas: {
    selectedClass: {
      id: ClassId;
    };
  };
}

interface ISelectedClassVariables {
  id: ClassId;
}

/**
 * Query component
 */
export class SelectedClassQuery extends Query<
  ISelectedClassData,
  ISelectedClassVariables
> {}

/**
 * GQL query string
 */
export const SELECTED_CLASS_QUERY = gql`
  query selectedClass($id: String!) {
    class(id: $id) @client {
      classType
      isSelected
      name
    }
    canvas @client {
      selectedClass
    }
  }
`;
