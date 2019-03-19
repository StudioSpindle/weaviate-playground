import { ApolloLink } from 'apollo-link';
import authLink from './authLink';
import httpLink from './httpLink';
import onErrorLink from './onError';
import restLink from './restLink';
import withClientStateLink from './withClientStateLink';

const link = ApolloLink.from([
  onErrorLink,
  withClientStateLink,
  authLink,
  restLink,
  httpLink
]);

export default link;
