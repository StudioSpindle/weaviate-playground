import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';

/**
 * Types
 */
interface IClassIdsData {
  canvas: {
    classIds: ClassId[];
  };
}

/**
 * Query component
 */
export class ClassIdsQuery extends Query<IClassIdsData> {}

/**
 * GQL query string
 */
export const CLASS_IDS_QUERY = gql`
  query classIds {
    canvas @client {
      classIds
    }
  }
`;
