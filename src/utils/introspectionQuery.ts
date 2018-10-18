import fetch from 'node-fetch';

export default (apiEndpoint: string) =>
  fetch(`${apiEndpoint}/graphql`, {
    body: JSON.stringify({
      query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
      variables: {}
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  })
    .then((result: any) => result.json())
    .then((result: any) => {
      // here we're filtering out any type information unrelated to unions or interfaces
      const filteredData = result.data.__schema.types.filter(
        (type: any) => type.possibleTypes !== null
      );
      result.data.__schema.types = filteredData;
      return result.data;
    });
