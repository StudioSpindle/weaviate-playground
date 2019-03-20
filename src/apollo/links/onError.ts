import { onError } from 'apollo-link-error';

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
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
    console.log(networkError);
  }
});

export default onErrorLink;
