export const resolvers = {
  Mutation: {
    updateSelectedNode: (
      _: any,
      variables: { id: string; isSelected: string },
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      const id = getCacheKey({ __typename: 'Node', id: variables.id });
      const data = { isSelected: variables.isSelected };
      cache.writeData({ id, data });
      return null;
    }
  },
  Node: {
    isSelected: () => false
  }
};

export const defaults = {};
