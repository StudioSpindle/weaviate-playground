import { IGraphLinks } from 'src/components/graph/types';
import defaults from 'src/resolvers/defaults';

const updateLinks = (
  _: any,
  variables: { links: IGraphLinks },
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const id = getCacheKey({ __typename: defaults.canvas.__typename });
  const data = {
    links: variables.links.map(link => ({ ...link, __typename: 'Link' }))
  };

  cache.writeData({ id, data });

  return null;
};

export default updateLinks;
