import { withClientState } from 'apollo-link-state';
import { defaults, resolvers } from 'src/resolvers';
import typeDefs from 'src/schema';

const withClientStateLink = withClientState({
  defaults,
  resolvers,
  typeDefs
});

export default withClientStateLink;
