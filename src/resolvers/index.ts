import gql from 'graphql-tag';
import { IUpdateNodesFiltersVariables } from 'src/components/library/queries';

export const defaults = {
  __type: {
    __typename: '__Type',
    isSelected: true
  },
  canvas: {
    __typename: 'Canvas',
    selectedNode: 'City',
    selectedNodes: [],
    zoom: 1
  },
  nodesFilters: {
    __typename: 'nodesFilters',
    nodeLocation: 'Local',
    nodeType: 'All',
    queryString: ''
  }
};

export const resolvers = {
  Mutation: {
    toggleLibraryNodeSelection: (
      _: any,
      variables: { typename: string; isSelected: boolean },
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      const id = getCacheKey({
        __typename: '__Type',
        name: variables.typename
      });
      const data = { isSelected: variables.isSelected };
      cache.writeData({ id, data });
      return null;
    },
    updateNodesFilters: (
      _: any,
      variables: IUpdateNodesFiltersVariables,
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
      if (typeof variables.queryString !== 'undefined') {
        data = { ...data, queryString: variables.queryString };
      }

      cache.writeData({ id, data });
      return null;
    },
    updateSelectedNodes: (
      _: any,
      variables: { typename: string },
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      const id = getCacheKey({ __typename: defaults.canvas.__typename });
      const query = cache.readQuery({
        query: gql`
          query selectedNodes {
            canvas {
              selectedNodes
            }
          }
        `
      });

      const selectedNodes = query.canvas.selectedNodes;
      let data = {};

      if (selectedNodes.includes(variables.typename)) {
        data = {
          selectedNodes: selectedNodes.filter(
            (typename: string) => typename !== variables.typename
          )
        };
      } else {
        data = {
          selectedNodes: [...selectedNodes, variables.typename]
        };
      }

      cache.writeData({ id, data });
      return null;
    }
  },
  __Type: {
    isSelected: () => false,
    nodeType: () => 'adfsf'
  }
};
