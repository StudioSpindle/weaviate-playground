import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import * as React from 'react';
import { createApiHeaders } from '../../apis/ApiWeaviate';

let gqlText = '# Weaviate GraphQL interface\n';
gqlText += '# More information: www.semi.technology\n';
gqlText += '#\n';
gqlText += '# Powered by GraphiQL\n';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const query = urlParams.get('query');
const queryObject = query ? JSON.parse(query) : gqlText;

const graphQLFetcher = (graphQLParams: any) =>
  fetch(uri, {
    body: JSON.stringify(graphQLParams),
    headers: createApiHeaders(),
    method: 'post'
  }).then(response => response.json());

class GraphiQLContainer extends React.Component {
  public render() {
    return (
      <div style={{ height: '100vh', zoom: '130%' }}>
        <style>{`
          .graphiql-container .title {
            display: none
          }
          .graphiql-container .execute-button-wrap {
            margin: 0
          }
        `}</style>
        <GraphiQL fetcher={graphQLFetcher} query={queryObject} />
      </div>
    );
  }
}

export default GraphiQLContainer;
