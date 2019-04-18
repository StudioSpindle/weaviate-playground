import { BatchHttpLink } from 'apollo-link-batch-http';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const batchUri = `${uri}/batch`;

const batchHttpLink = new BatchHttpLink({
  credentials: 'same-origin',
  headers: { batch: 'true ' },
  uri: batchUri
});

export default batchHttpLink;
