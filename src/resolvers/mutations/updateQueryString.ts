import defaults from 'src/resolvers/defaults';

const updateQueryString = (
  _: any,
  variables: {
    hasActiveSourceLinks: boolean;
    hasActiveTargetLinks: boolean;
    queryString: string;
  },
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const id = getCacheKey({ __typename: defaults.canvas.__typename });
  let data = {};

  data = {
    hasActiveSourceLinks: variables.hasActiveSourceLinks,
    hasActiveTargetLinks: variables.hasActiveTargetLinks,
    queryString: variables.queryString
  };

  cache.writeData({ id, data });

  return null;
};

export default updateQueryString;
