import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';
import { ClassType } from 'src/types';

// TODO: add types and query component
/**
 * Types
 */
interface IClassData {
  class: {
    id: ClassId;
    classType: ClassType;
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
      id
      classType
    }
  }
`;
