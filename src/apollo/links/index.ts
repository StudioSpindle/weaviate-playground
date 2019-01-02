import { ApolloLink } from 'apollo-link';
import authLink from './authLink';
import httpLink from './httpLink';
import onErrorLink from './onError';
import withClientStateLink from './withClientStateLink';

const link = ApolloLink.from([
  onErrorLink,
  withClientStateLink,
  authLink,
  httpLink
]);

export default link;
