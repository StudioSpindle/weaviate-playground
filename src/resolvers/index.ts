import nodes from 'src/resolvers/nodes';
import { NodeLocation, NodeType } from 'src/types';

export const defaults = {
  node: {
    isSelected: false
  },
  nodesFilters: {
    nodeLocation: 'local',
    nodeType: 'all',
    // tslint:disable-next-line:object-literal-sort-keys
    __typename: 'nodesFilters'
  }
};

export const resolvers = {
  Mutation: {
    updateNodesFilters: (
      _: any,
      variables: { nodeLocation?: NodeLocation; nodeType?: NodeType },
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      const id = getCacheKey({ __typename: defaults.nodesFilters.__typename });
      let data = {};
      if (variables.nodeLocation) {
        data = { ...data, nodeLocation: variables.nodeLocation };
      }
      if (variables.nodeType) {
        data = { ...data, nodeType: variables.nodeType };
      }

      cache.writeData({ id, data });
      return null;
    },
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
  },
  Query: {
    nodes
  }
};
