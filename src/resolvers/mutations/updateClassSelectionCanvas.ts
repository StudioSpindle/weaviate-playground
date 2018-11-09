import gql from 'graphql-tag';
import defaults from 'src/resolvers/defaults';

const updateClassSelectionCanvas = (
  _: any,
  variables: { id: string },
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const __typename = defaults.canvas.__typename;
  const id = getCacheKey({ __typename });

  const classQuery = cache.readQuery({
    query: gql`
      query SelectedClass($id: String!) {
        class(id: $id) {
          filters
          id
          instance
          name
          classLocation
          classType
        }
      }
    `,
    variables: {
      id: variables.id
    }
  });

  const data = {
    canvas: {
      __typename,
      selectedClass: classQuery.class
    }
  };

  cache.writeData({ id, data });
  return null;
};

export default updateClassSelectionCanvas;
