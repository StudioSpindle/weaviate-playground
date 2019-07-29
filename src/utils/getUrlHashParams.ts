export interface IGetUrlHashParamsProps {
  url: string;
}

export default ({
  url
}: IGetUrlHashParamsProps): { access_token?: string; graphiql?: boolean } => {
  const hashes = url.slice(url.indexOf('#') + 1).split('&');
  const params: any = {};

  hashes.map(hash => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });

  return params;
};
