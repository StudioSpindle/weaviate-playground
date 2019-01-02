import { ApolloClient } from 'apollo-client';
import cache from './cache';
import link from './links';

const client = new ApolloClient({
  cache,
  link
});

export default client;
