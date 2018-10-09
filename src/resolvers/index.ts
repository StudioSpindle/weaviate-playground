import queries from 'src/components/introspector/queries';
import { NodeType } from 'src/components/library/Library';

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
  },
  Query: {
    getNodes: (
      _: any,
      variables: { location: Location; nodeType: NodeType },
      { cache, getCacheKey }: { cache: any; getCacheKey: any }
    ) => {
      let actions: any[] = [];
      let things: any[] = [];

      const data = cache.readQuery({
        query: queries.TYPES_INTROSPECTION_QUERY
      });

      const setActions = () => {
        const actionsObj = data.__schema.types.find(
          (type: any) => type.name === 'WeaviateLocalGetActionsObj'
        );

        actions = actionsObj.fields.map((action: any) => ({
          ...action,
          nodeType: 'action'
        }));
      };

      const setThings = () => {
        const thingsObj = data.__schema.types.find(
          (type: any) => type.name === 'WeaviateLocalGetThingsObj'
        );

        things = thingsObj.fields.map((thing: any) => ({
          ...thing,
          nodeType: 'thing'
        }));
      };

      if (variables.nodeType === 'action') {
        setActions();
      } else if (variables.nodeType === 'thing') {
        setThings();
      } else {
        setActions();
        setThings();
      }

      return [...actions, ...things];
    }
  }
};

export const defaults = {};
