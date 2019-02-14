import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { IGraphLinks } from 'src/components/graph/types';

/**
 * Types
 */
interface ILinksData {
  canvas: {
    links: IGraphLinks;
  };
}

/**
 * Query component
 */
export class LinksQuery extends Query<ILinksData> {}

/**
 * GQL query string
 */
export const LINKS_QUERY = gql`
  query LinksForResultsContainer {
    canvas @client {
      links {
        isActive
        source
        target
        value
      }
    }
  }
`;
