import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import cache from './cache';
import link from './links';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(link)
});

export default client;
