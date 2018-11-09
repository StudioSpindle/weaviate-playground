import gql from 'graphql-tag';
import defaults from 'src/resolvers/defaults';

const updateClass = (
  _: any,
  variables: any,
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  /**
   * Store class on client
   */
  const id = `${defaults.class.__typename}:${variables.id}`;
  cache.writeData({
    data: {
      classLocation: variables.classLocation,
      classType: variables.classType,
      filters: variables.filters,
      id: variables.id,
      instance: variables.instance,
      isSelected: variables.isSelected || false,
      name: variables.name
    },
    id
  });

  /**
   * Update list with classes
   */
  const canvasId = getCacheKey({ __typename: defaults.canvas.__typename });

  const data = cache.readQuery({
    query: gql`
      query classIds {
        canvas @client {
          classIds
        }
      }
    `
  });

  if (!data.canvas.classIds.includes(id)) {
    data.canvas.classIds.push(variables.id);
  }

  cache.writeData({ id: canvasId, data });
  return null;
};

export default updateClass;
