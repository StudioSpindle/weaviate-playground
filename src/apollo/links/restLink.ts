import { RestLink } from 'apollo-link-rest';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');

const restLink = new RestLink({
  responseTransformer: async data => {
    if (data) {
      const text = await data.text();
      return text.length ? JSON.parse(text) : {};
    }

    return {};
  },
  uri: url
});

export default restLink;
