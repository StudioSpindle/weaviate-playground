export type SchemaTypeName = string;
export type SchemaTypeKind =
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'OBJECT'
  | 'SCALAR'
  | 'UNION';
export type SchemaTypename = '__Type' | '__Field';

interface ISchemaFieldType {
  kind: SchemaTypeKind;
  name: SchemaTypeName;
  ofType: SchemaTypeName;
  __typename: SchemaTypename;
}

interface ISchemaField {
  args: [];
  deprecationReason?: string;
  description: string;
  isDeprecated: boolean;
  name: SchemaTypeName;
  type: ISchemaFieldType;
  __typename: SchemaTypename;
}

interface ISchemaType {
  description: string;
  enumValues: any;
  fields: [ISchemaField];
  inputFields: any;
  interfaces: [];
  kind: SchemaTypeKind;
  name: string;
  possibleTypes: [ISchemaFieldType];
  __typename: SchemaTypename;
}

interface IActionType {
  name: SchemaTypeName;
}

interface ISchema {
  directives: [];
  mutationType: IActionType;
  queryType: IActionType;
  subscriptionType: IActionType;
  types: [ISchemaType];
}

const composeQueryObjectFromUnion = (
  schema: ISchema,
  field: ISchemaField,
  skipFields?: string[]
): string | undefined => {
  const union = schema.types.find((type: any) => type.name === field.type.name);

  if (!union) {
    return undefined;
  }

  const unionName = union.possibleTypes[0].name;
  const name = `... on ${unionName}`;

  return `${field.name} {
    ${composeQueryObject(schema, unionName, name, skipFields)}
  }`;
};

const composeQueryObject = (
  schema: ISchema,
  typeName: SchemaTypeName,
  name: string,
  skipFields?: string[]
): string | undefined => {
  const schemaType = schema.types.find((type: any) => type.name === typeName);
  // TODO: Dynamically add params. Param specs should come from introspection.
  let params = '';
  if (typeName === 'WeaviateNetworkFetchFuzzyObj') {
    params = '(value: "", certainty: 0.5)';
  } else if (typeName === 'WeaviateNetworkIntrospectBeaconObj') {
    params = '(id: "0")';
  }

  if (schemaType) {
    const query: string = `
    ${name}${params} {
      ${schemaType.fields.map((field: any) => {
        if (field.type.isDeprecated) {
          // tslint:disable-next-line:no-console
          console.log(`Deprecated: ${field.type.deprecationReason}`);
        } else if (skipFields && skipFields.includes(field.name)) {
          // tslint:disable-next-line:no-console
          console.log(`Skipped: ${field.type.name}`);
        } else if (field.type.kind === 'OBJECT') {
          return composeQueryObject(
            schema,
            field.type.name,
            field.name,
            skipFields
          );
        } else if (field.type.ofType && field.type.ofType.kind === 'OBJECT') {
          return composeQueryObject(
            schema,
            field.type.ofType.name,
            field.name,
            skipFields
          );
        } else if (field.type.kind === 'UNION') {
          return composeQueryObjectFromUnion(schema, field, skipFields);
        } else {
          return field.name;
        }
      })}
    }
  `;

    return query;
  } else {
    // tslint:disable-next-line:no-console
    console.log(`Unable to find schema type ${typeName}`);
    return undefined;
  }
};

export default composeQueryObject;
