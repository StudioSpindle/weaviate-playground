const getSchemaTypeObj = (types: any, typeName: string) =>
  types.find((type: any) => type.name === typeName);

export default getSchemaTypeObj;
