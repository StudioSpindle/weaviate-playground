export function createApiHeaders() {
  const h = new Headers();

  h.append('Content-Type', 'application/json');
  h.append('Accept', 'application/json');

  const session = {
    token: localStorage.getItem('token')
  };

  if (session.token) {
    h.append('Authorization', `Bearer ${session.token}`);
  }

  return h;
}

// TODO: Rather than having all API methods spread in the entire app,
//   add the API as example #3 in this source: https://codeburst.io/how-to-call-api-in-a-smart-way-2ca572c6fe86

// export default class WeaviateApi {
//
//   constructor( {url} ){
//     url: string;
//   };
//
//   createEndpoints
//
//
//
// }
