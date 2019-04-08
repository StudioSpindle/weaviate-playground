import gql from 'graphql-tag';

const updateMetaCount = (
  _: any,
  variables: {
    className: string;
    addition: boolean;
  },
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  // tslint:disable-next-line:variable-name
  const __typename = `Meta${variables.className}MetaObj`;
  const id = getCacheKey({ __typename });

  const fragment = gql`
    fragment count on ${__typename} {
        count
        __typename
    }
    `;

  const metaObj = cache.readFragment({ fragment, id });
  const count = variables.addition ? metaObj.count + 1 : metaObj.count - 1;
  const data = { ...metaObj, count, __typename };
  cache.writeFragment({ id, fragment, data });
  return null;
};

export default updateMetaCount;
