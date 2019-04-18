import { ApolloLink } from 'apollo-link';
import authLink from './authLink';
import batchHttpLink from './batchHttpLink';
import onErrorLink from './onError';
import restLink from './restLink';
import withClientStateLink from './withClientStateLink';

const link = ApolloLink.from([
  onErrorLink,
  withClientStateLink,
  authLink,
  restLink,
  batchHttpLink
]);

export default link;
