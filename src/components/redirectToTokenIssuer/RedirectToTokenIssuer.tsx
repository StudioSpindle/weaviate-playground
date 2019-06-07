import * as React from 'react';
// import { BrowserRouter, Redirect, Route } from 'react-router-dom';

interface IRedirectToTokenIssuerState {
  isLoading: boolean;
  error?: {
    message?: string;
  };
  endPoint?: any;
}

interface IConfig {
  clientId: string;
  responseType: string;
}

// this can be made into a JSON file?
const CONFIG: IConfig = {
  clientId: 'SF_SEMI', // required and client specific
  responseType: 'token'
};

// tslint:disable-next-line:no-empty-interface
interface IRedirectToTokenIssuerProps {}

class RedirectToTokenIssuer extends React.Component<
  IRedirectToTokenIssuerProps,
  IRedirectToTokenIssuerState
> {
  constructor(props: IRedirectToTokenIssuerProps) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  public async componentDidMount() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const uri = urlSearchParams.get('weaviateUri') || '';
    const weaviateUrl = uri.replace('graphql', '');
    const weaviateDiscoveryUrl =
      weaviateUrl + '.well-known/openid-configuration';

    // tslint:disable-next-line:no-console
    console.log('url: ', weaviateDiscoveryUrl);

    await this.fetchRegistrationEndPoint(weaviateDiscoveryUrl);
  }

  public fetchRegistrationEndPoint(url: string) {
    // tslint:disable-next-line:no-console
    console.log('the registration endpoint is being fetched.');

    fetch(url)
      .then(async res => {
        if (res.ok) {
          return await res.json();
        }
        throw new Error(res.statusText);
      })
      .then(resJson => {
        if (resJson.href) {
          this.fetchAuthUrl(resJson.href);
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          isLoading: false
        });
        throw new Error(err.message);
      });
  }

  public fetchAuthUrl(url: string) {
    // tslint:disable-next-line:no-console
    console.log('the auth url is being fetched.');

    fetch(url)
      .then(async res => {
        if (res.ok) {
          return await res.json();
        }
      })
      .then(resJson => {
        this.fetchToken(resJson.authorization_endpoint);
      })
      .catch(err => {
        this.setState({
          error: err,
          isLoading: false
        });
        throw new Error(err.message);
      });
  }

  public fetchToken(url: string) {
    // tslint:disable-next-line:no-console
    console.log('the token is being fetched.');

    const redirectUrlEncoded = encodeURIComponent(
      window.location.protocol + '//' + window.location.host
    );

    const oAuthUrl = `${url}?client_id=${CONFIG.clientId}&response_type=${
      CONFIG.responseType
    }&redirect_uri=${redirectUrlEncoded}`;

    fetch(oAuthUrl)
      .then(async res => {
        if (res.ok) {
          return await res.json();
        }
      })
      .then(resJson => {
        // tslint:disable-next-line:no-console
        console.log('output of token issuer: ', resJson);
      })
      .catch(err => {
        this.setState({
          error: err,
          isLoading: false
        });
        throw new Error(err.message);
      });
  }

  public render() {
    const { isLoading, error, endPoint } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (!isLoading && endPoint) {
      // const tokenIssuerUrl = this.createTokenRequestUrl();

      // tslint:disable-next-line:no-console
      // console.log('tokenIssuerUrl in render function: ', tokenIssuerUrl);

      return (
        <React.Fragment>
          <div>
            <p>Token is being fetched, see console</p>
            {/*<BrowserRouter>*/}
            {/*  <Route>*/}
            {/*    <Redirect*/}
            {/*      to={{*/}
            {/*        pathname: window.location.href = tokenIssuerUrl,*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </Route>*/}
            {/*</BrowserRouter>*/}
          </div>
        </React.Fragment>
      );
    }

    return <h3>Loading...</h3>;
  }
}

export default RedirectToTokenIssuer;
