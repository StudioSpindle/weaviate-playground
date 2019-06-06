import * as React from 'react';
// import { BrowserRouter, Redirect, Route } from 'react-router-dom';

interface IRedirectToTokenIssuerState {
  isLoading: boolean;
  error?: {
    message?: string;
  };
  endPoint?: any;
  issueTokenheaders?: Headers;
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
    await this.fetchRegistrationEndPoint();

    // tslint:disable-next-line:no-console
    console.log(
      'this.state.endPoint in async component did mount',
      this.state.endPoint
    );

    if (!this.state.isLoading && this.state.endPoint) {
      // TODO if endpoint not found in state, use the await this function above to store the url and reuse in the next fetch

      // tslint:disable-next-line:no-console
      console.log(
        'this fetch is done, that means that the endpoint is found in the component did mount...'
      );
      await this.fetchToken(this.state.endPoint);
    }
  }

  public fetchRegistrationEndPoint() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const uri = urlSearchParams.get('weaviateUri') || '';
    const currentUrl = uri.replace('graphql', '');

    const apiUrl = currentUrl + '.well-known/openid-configuration';

    fetch(apiUrl)
      .then(async res => {
        if (res.ok) {
          this.setState({
            issueTokenheaders: res.headers
          });

          return await res.json();
        }
        throw new Error(res.statusText);
      })
      .then(resJson => {
        // tslint:disable-next-line:no-console
        console.log('resJson: ', resJson);

        this.setState({
          endPoint: resJson.authorization_endpoint,
          isLoading: false
        });
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
    fetch(url, { headers: this.state.issueTokenheaders })
      .then(async res => {
        if (res.ok) {
          // tslint:disable-next-line:no-console
          console.log('header spoofing worked!');

          return await res.json();
        }
        throw new Error(res.statusText);
      })
      .then(resJson => {
        // tslint:disable-next-line:no-console
        console.log('does this contain the token? ', resJson);

        // this.setState({
        //   token: resJson.authorization_endpoint,
        //   isLoading: false
        // });
      })
      .catch(err => {
        this.setState({
          error: err,
          isLoading: false
        });

        throw new Error(err.message);
      });
  }

  public createTokenRequestUrl() {
    const redirectUrlEncoded = encodeURIComponent(
      window.location.protocol + '//' + window.location.host
    );

    const oAuthUrl = `${this.state.endPoint}?client_id=${
      CONFIG.clientId
    }&response_type=${CONFIG.responseType}&redirect_uri=${redirectUrlEncoded}`;

    return oAuthUrl;
  }

  public render() {
    const { isLoading, error, endPoint } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (!isLoading && endPoint) {
      const tokenIssuerUrl = this.createTokenRequestUrl();

      // tslint:disable-next-line:no-console
      console.log('tokenIssuerUrl in render function: ', tokenIssuerUrl);

      // tslint:disable-next-line:no-debugger
      debugger;

      return (
        <React.Fragment>
          <div>
            <p>Thing is being fetched, see console</p>
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
