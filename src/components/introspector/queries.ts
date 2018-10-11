import gql from 'graphql-tag';

// Fragments

const TYPE_REF_FRAGMENT = gql`
  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

const INPUT_VALUE_FRAGMENT = gql`
  fragment InputValue on __InputValue {
    name
    description
    type {
      ...TypeRef
    }
    defaultValue
  }
  ${TYPE_REF_FRAGMENT}
`;

const FULL_TYPE_FRAGMENT = gql`
  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }
  ${INPUT_VALUE_FRAGMENT}
  ${TYPE_REF_FRAGMENT}
`;

// Queries

export const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      subscriptionType {
        name
      }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
      __typename
    }
  }
  ${INPUT_VALUE_FRAGMENT}
  ${FULL_TYPE_FRAGMENT}
`;

export const TYPES_INTROSPECTION_QUERY = gql`
  query TypesIntrospectionQuery {
    __schema {
      types {
        ...FullType
      }
      __typename
    }
  }
  ${FULL_TYPE_FRAGMENT}
`;
