import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGetMetaTypeData {
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

interface IGetMetaTypeVariables {
  typename: string;
}

/**
 * Query component
 */
export class GetMetaTypeQuery extends Query<
  IGetMetaTypeData,
  IGetMetaTypeVariables
> {}

/**
 * GQL query string
 */
export const GET_META_TYPE = gql`
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
