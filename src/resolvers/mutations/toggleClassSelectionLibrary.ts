import gql from 'graphql-tag';
import defaults from 'src/resolvers/defaults';

const toggleClassSelectionLibrary = (
  _: any,
  variables: { id: string },
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const id = getCacheKey({
    __typename: defaults.class.__typename,
    id: variables.id
  });

  const classQuery = cache.readQuery({
    query: gql`
      query classSelected($id: String!) {
        class(id: $id) {
          isSelected
        }
      }
    `,
    variables: {
      id: variables.id
    }
  });

  const data = { isSelected: !classQuery.class.isSelected };
  cache.writeData({ id, data });
  return null;
};

export default toggleClassSelectionLibrary;
