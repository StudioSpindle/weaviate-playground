import { TYPES_INTROSPECTION_QUERY } from 'src/components/introspector/queries';
import { INodesQueryVariables } from 'src/types';
import { getSchemaTypeObj, isNodeSelected } from 'src/utils';

const nodes = (
  _: any,
  variables: INodesQueryVariables,
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const actionsInstanceNames: string[] = [];
  let actions: any[] = [];
  const thingsInstanceNames: string[] = [];
  let things: any[] = [];

  const data = cache.readQuery({
    query: TYPES_INTROSPECTION_QUERY
  });

  const schemaTypes = data.__schema.types;
  if (variables.nodeLocation === 'local') {
    actionsInstanceNames.push('WeaviateLocalGetActionsObj');
    thingsInstanceNames.push('WeaviateLocalGetThingsObj');
  } else if (variables.nodeLocation === 'network') {
    const weaviateNetworkGetObj = getSchemaTypeObj(
      schemaTypes,
      'WeaviateNetworkGetObj'
    );

    weaviateNetworkGetObj.fields.forEach((field: any) => {
      const instance = getSchemaTypeObj(schemaTypes, field.type.name);

      instance.fields.forEach((instanceField: any) => {
        const typeName = instanceField.type.name;
        if (typeName.includes('Things')) {
          thingsInstanceNames.push(typeName);
        } else if (typeName.includes('Actions')) {
          actionsInstanceNames.push(typeName);
        }
      });
    });
  }

  const setActions = () => {
    const tempActions: any[] = [];

    actionsInstanceNames.forEach(instanceName => {
      const actionsObjects = getSchemaTypeObj(schemaTypes, instanceName);
      actionsObjects.fields.forEach((action: any) => {
        const isSelected = isNodeSelected([], action.name);
        if (
          typeof variables.isSelected === 'undefined' ||
          variables.isSelected === action.isSelected
        ) {
          tempActions.push({
            ...action,
            isSelected,
            nodeType: 'action'
          });
        }
      });
    });

    actions = tempActions;
  };

  const setThings = () => {
    const tempThings: any[] = [];

    thingsInstanceNames.forEach(instanceName => {
      const thingsObjects = getSchemaTypeObj(schemaTypes, instanceName);
      thingsObjects.fields.forEach((thing: any) => {
        const isSelected = isNodeSelected([], thing.name);
        if (
          typeof variables.isSelected === 'undefined' ||
          variables.isSelected === isSelected
        ) {
          tempThings.push({
            ...thing,
            isSelected,
            nodeType: 'thing'
          });
        }
      });
    });

    things = tempThings;
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
};

export default nodes;
