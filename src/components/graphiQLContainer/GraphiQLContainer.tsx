import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import * as React from 'react';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const query = urlParams.get('query');
const queryObject = query ? JSON.parse(query) : undefined;

const graphQLFetcher = (graphQLParams: any) =>
  fetch(uri, {
    body: JSON.stringify(graphQLParams),
    headers: { 'Content-Type': 'application/json' },
    method: 'post'
  }).then(response => response.json());

class GraphiQLContainer extends React.Component {
  public render() {
    return (
      <div style={{ height: '100vh' }}>
        <GraphiQL fetcher={graphQLFetcher} query={queryObject} />
      </div>
    );
  }
}

export default GraphiQLContainer;
