import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IMetaTypeData {
  __type: {
    name: string;
    fields: Array<{
      name: string;
      type: {
        name: string;
      };
    }>;
  };
}

interface IMetaTypeVariables {
  typename: string;
}

/**
 * Query component
 */
export class MetaTypeQuery extends Query<IMetaTypeData, IMetaTypeVariables> {}

/**
 * GQL query string
 */
export const META_TYPE_QUERY = gql`
  query MetaTypeForFilters($typename: String!) {
    __type(name: $typename) {
      name
      fields {
        name
        type {
          name
        }
      }
    }
  }
`;
