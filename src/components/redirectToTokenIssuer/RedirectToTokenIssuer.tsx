import nanoid from 'nanoid';
import * as React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';

interface IRedirectToTokenIssuerState {
  isLoading: boolean;
  error?: {
    message?: string;
  };
  endPoint?: any;
}

interface IConfig {
  clientId: string;
  openIdDiscoveryUrl: string;
  randomNano: string;
  responseType: string;
  scope: string;
}

// TODO: Replace this URL with the Weaviate end point:
//  note: extract the first part of the url 'http://localhost:8080/' from the input field of the welcome form
//  $ curl -L http://localhost:8080/weaviate/v1/.well-known/openid-configuration
//  ...
//  the -L means  "automatically follow 3xx redirects"
//  - if OIDC is configured you'll get a 302 with a Location header of where to redirect (most clients can follow those redirects automatically, but you can always redirect manually, too, just read the header)
//  - else 404 if no OIDC issuer is configured
//  ...

const CONFIG: IConfig = {
  clientId: 'demo',
  // for Metro: https://idam-pp.metrosystems.net/.well-known/openid-configuration
  openIdDiscoveryUrl:
    'http://localhost:8080/auth/realms/weaviate/.well-known/openid-configuration',
  randomNano: nanoid(),
  responseType: 'token',
  scope: 'openid%20profile'
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

  public componentDidMount() {
    this.fetchRegistrationEndPoint();
  }

  public fetchRegistrationEndPoint() {
    const apiUrl = CONFIG.openIdDiscoveryUrl;

    fetch(apiUrl, {})
      .then(res => {
        return res.json();
      })
      .then(resJson => {
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

  public render() {
    const { isLoading, error, endPoint } = this.state;

    const redirectUrlEncoded = encodeURIComponent(
      window.location.protocol + '//' + window.location.host
    );

    const oAuthUrl = `${endPoint}?response_type=${
      CONFIG.responseType
    }&client_id=${CONFIG.clientId}&scope=${CONFIG.scope}&nonce=${
      CONFIG.randomNano
    }&redirect_uri=${redirectUrlEncoded}`;

    /**
     * Store random identifier in localhost for nonce to prevent token replay attack
     */
    window.localStorage.setItem('nonce', CONFIG.randomNano);

    return (
      <React.Fragment>
        {error ? <p>{error.message}</p> : null}
        {!isLoading ? (
          <div>
            <BrowserRouter>
              <Route>
                <Redirect to={(window.location.href = oAuthUrl)} />
              </Route>
            </BrowserRouter>
          </div>
        ) : (
          <h3>Loading...</h3>
        )}
      </React.Fragment>
    );
  }
}

export default RedirectToTokenIssuer;
