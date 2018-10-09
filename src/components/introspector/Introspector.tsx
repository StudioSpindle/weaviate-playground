import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { SchemaTypeName } from 'src/utils/composeQueryObject';
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
    return (
      <Query query={queries.INTROSPECTION_QUERY}>
        {introspectionQuery => {
          if (introspectionQuery.loading) {
            return 'Introspecting schema...';
          }
          if (introspectionQuery.error) {
            // tslint:disable-next-line:no-console
            console.log('--- Missing weaviate uri ---');
            return `${introspectionQuery.error.message}`;
          }

          return this.props.children;
        }}
      </Query>
    );
  }
}

export default Introspector;
