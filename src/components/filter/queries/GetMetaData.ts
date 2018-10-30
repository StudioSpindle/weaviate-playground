import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
interface IGetMetaDataData {
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

interface IGetMetaDataVariables {
  typename: string;
}

/**
 * Query component
 */
export class GetMetaDataQuery extends Query<
  IGetMetaDataData,
  IGetMetaDataVariables
> {}

/**
 * GQL query string
 */
// TODO: make query dynamic
export const GET_META_DATA = gql`
  query MetaDataForFilter {
    Local {
      GetMeta {
        Things {
          City {
            population {
              type
              count
              lowest
              highest
              average
              sum
            }
          }
        }
      }
    }
  }
`;
