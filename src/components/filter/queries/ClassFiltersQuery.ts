import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';

/**
 * Types
 */
interface IClassFiltersData {
  class: {
    id: string;
    filters: string;
  };
}

interface IClassFiltersVariables {
  id: ClassId;
}

/**
 * Query component
 */
export class ClassFiltersQuery extends Query<
  IClassFiltersData,
  IClassFiltersVariables
> {}

/**
 * GQL query string
 */
export const CLASS_FILTERS_QUERY = gql`
  query ClassFilters {
    class(id: $id) @client {
      id
      filters
    }
  }
`;
