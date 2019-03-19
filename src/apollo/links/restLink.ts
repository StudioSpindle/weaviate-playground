import { RestLink } from 'apollo-link-rest';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');

const restLink = new RestLink({
  uri: url
});

export default restLink;
