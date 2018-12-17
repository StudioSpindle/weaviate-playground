import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';
import { ClassLocation, ClassType } from 'src/types';

/**
 * Types
 */
interface IClassData {
  class: {
    instance: string;
    name: string;
    classLocation: ClassLocation;
    classType: ClassType;
    filters: string;
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
  query Class($id: String!) {
    class(id: $id) @client {
      instance
      name
      classLocation
      classType
      filters
    }
  }
`;
