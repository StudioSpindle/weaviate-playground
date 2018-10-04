import gql from 'graphql-tag';
import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';
import composeQueryObject, {
  SchemaTypeName
} from 'src/utils/composeQueryObject';
import queries from './queries';

interface IIntrospectorProps {
  skipFields: SchemaTypeName[];
}

class Introspector extends React.Component<IIntrospectorProps> {
  public cloneChild(
    child: React.ReactElement<any>,
    query: QueryResult
  ): React.ReactElement<any> {
    return React.cloneElement<any>(child, {
      ...child.props,
      ...query
    });
  }

  public render() {
    const { skipFields } = this.props;
    return (
      <Query query={queries.INTROSPECTION_QUERY}>
        {introspectionQuery => {
          if (introspectionQuery.loading) {
            return 'Loading...';
          }
          if (introspectionQuery.error) {
            return `Error! ${introspectionQuery.error.message}`;
          }

          const schema = introspectionQuery.data.__schema;
          const name = schema.queryType.name;
          const query =
            composeQueryObject(schema, name, 'query Root', skipFields) || '';
          const SCHEMA_QUERY = gql(query);

          return (
            <Query query={SCHEMA_QUERY}>
              {schemaQuery => {
                if (schemaQuery.loading) {
                  return 'Loading...';
                }

                if (schemaQuery.error) {
                  return `Error! ${schemaQuery.error.message}`;
                }

                return React.Children.map(
                  this.props.children,
                  child =>
                    typeof child === 'number' || typeof child === 'string'
                      ? child
                      : this.cloneChild(child, schemaQuery)
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default Introspector;
