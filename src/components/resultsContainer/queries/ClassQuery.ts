import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';
import { ClassLocation, ClassType } from 'src/types';

/**
 * Types
 */
interface IClassData {
  class: {
    id: ClassId;
    classType: ClassType;
    classLocation: ClassLocation;
    filters: string;
    instance: string;
    name: string;
  };
}

interface IClassVariables {
  id: ClassId;
}

/**
 * Query component
 */
export class ClassQuery extends Query<IClassData, IClassVariables> {}

/**
 * GQL query string
 */
export const CLASS_QUERY = gql`
  query ClassForResultsContainer($id: String!) {
    class(id: $id) @client {
      id
      classType
      classLocation
      filters
      instance
      name
    }
  }
`;
