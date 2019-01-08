import { InMemoryCache } from 'apollo-cache-inmemory';
import { defaults } from 'src/resolvers';
import dataIdFromObject from './dataIdFromObject';

export const getName = (object: any) => object.name;

const cache = new InMemoryCache({
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
  dataIdFromObject
});

export default cache;
