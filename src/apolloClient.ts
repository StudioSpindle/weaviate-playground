import { defaultDataIdFromObject, InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http'; // Use apollo-link-batch-http for performance when server accepts req.body array
import { withClientState } from 'apollo-link-state';
import { defaults, resolvers } from 'src/resolvers';
import typeDefs from 'src/schema';
// import introspectionQuery from 'src/utils/introspectionQuery';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';

// const introspectionQueryResultData = introspectionQuery(uri);
// // tslint:disable-next-line:no-console
// console.log(introspectionQueryResultData);

const getName = (object: any) => object.name;

const cache: InMemoryCache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      __field: (_, object, { getCacheKey }) => {
        const name = getName(object);
        return getCacheKey({ __typename: '__Field', id: name });
      },
      __schema: (_, { _id }, { getCacheKey }) =>
        getCacheKey({ __typename: '__Schema', id: '__Schema' }),
      class: (_, object, { getCacheKey }) =>
        getCacheKey({
          __typename: defaults.class.__typename,
          id: object.id
        })
    }
  },
  dataIdFromObject: (object: any) => {
    const name = getName(object);
    switch (object.__typename) {
      case defaults.canvas.__typename:
      case defaults.classesFilters.__typename:
      case '__Schema':
        return object.__typename;
      case '__Field':
        if (name) {
          return `__Field:${name}`;
        }
        return `__Field:${object.id}`;
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
    uri
  })
]);

const client = new ApolloClient({
  cache,
  link
});

export default client;
