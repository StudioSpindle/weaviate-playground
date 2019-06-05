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
  issuerUrl: string;
  randomNano: string;
  realm: string;
  responseType: string;
  scope: string;
}

// TODO: Replace clientId, issuerUrl and realm this with input options on homepage
const CONFIG: IConfig = {
  clientId: 'demo',
  issuerUrl: location.protocol + '//' + location.hostname + ':9090',
  randomNano: nanoid(),
  realm: 'weaviate',
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
    const apiUrl = `${CONFIG.issuerUrl}/auth/realms/${
      CONFIG.realm
    }/.well-known/openid-configuration`;

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
