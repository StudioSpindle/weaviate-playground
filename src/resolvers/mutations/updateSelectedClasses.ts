import gql from 'graphql-tag';
import defaults from 'src/resolvers/defaults';

const updateSelectedClasses = (
  _: any,
  variables: { id: string },
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const id = getCacheKey({ __typename: defaults.canvas.__typename });
  const query = cache.readQuery({
    query: gql`
      query selectedClasses {
        canvas {
          selectedClasses
        }
      }
    `
  });

  const selectedClasses = query.canvas.selectedClasses;
  let data = {};

  if (selectedClasses.includes(variables.id)) {
    data = {
      selectedClasses: selectedClasses.filter(
        (classId: string) => classId !== variables.id
      )
    };
  } else {
    data = {
      selectedClasses: [...selectedClasses, variables.id]
    };
  }

  cache.writeData({ id, data });

  return null;
};

export default updateSelectedClasses;
