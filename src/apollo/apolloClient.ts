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
      'X-API-KEY': '657a48b9-e000-4d9a-b51d-69a0b621c1b9',
      'X-API-TOKEN': '57ac8392-1ecc-4e17-9350-c9c866ac832b',
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(link)
});

export default client;
