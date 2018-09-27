import { defaultDataIdFromObject, InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http'; // Use apollo-link-batch-http for performance when server accepts req.body array
import { withClientState } from 'apollo-link-state';
import { defaults, resolvers } from 'src/resolvers';
import typeDefs from 'src/schema';

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      default:
        return defaultDataIdFromObject(object);
    }
  }
});

const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        // tslint:disable-next-line:no-console
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      // tslint:disable-next-line:no-console
      console.log(`[Network error]: ${networkError}`);
    }
  }),
  withClientState({
    defaults,
    resolvers,
    typeDefs
  }),
  new HttpLink({
    credentials: 'same-origin',
    uri: 'http://localhost:8081/graphql'
  })
]);

const client = new ApolloClient({
  cache,
  link
});

export default client;
