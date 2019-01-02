import { HttpLink } from 'apollo-link-http';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';

const httpLink = new HttpLink({
  credentials: 'same-origin',
  uri
});

export default httpLink;
