import { ApolloLink } from 'apollo-link';

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'X-API-KEY': '657a48b9-e000-4d9a-b51d-69a0b621c1b9',
      'X-API-TOKEN': '57ac8392-1ecc-4e17-9350-c9c866ac832b'
    }
  }));

  if (forward) {
    return forward(operation);
  }

  return null;
});

export default authLink;
