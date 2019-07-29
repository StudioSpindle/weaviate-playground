import * as React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';

interface IRedirectToTokenIssuerState {
  isLoading: boolean;
  error?: {
    message?: string;
  };
  oAuthLoginUrl?: string;
}

interface IConfig {
  responseType: string;
}

// this can be made into a JSON file?
const CONFIG: IConfig = {
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
        if (resJson.href && resJson.clientId) {
          this.fetchAuthUrl(resJson.href, resJson.clientId);
          return;
        }

        throw new Error(
          'expected to get .href and .clientId from backend, but got: ' +
            JSON.stringify(resJson)
        );
      })
      .catch(err => {
        this.setState({
          error: err,
          isLoading: false
        });
        throw new Error(err.message);
      });
  }

  public fetchAuthUrl(url: string, clientId: string) {
    // tslint:disable-next-line:no-console
    console.log('the auth url is being fetched.');

    fetch(url)
      .then(async res => {
        if (res.ok) {
          return await res.json();
        }
      })
      .then(resJson => {
        const redirectUrlEncoded = encodeURIComponent(
          window.location.protocol + '//' + window.location.host
        );

        const oAuthUrlLoginUrl = `${
          resJson.authorization_endpoint
        }?client_id=${clientId}&response_type=${
          CONFIG.responseType
        }&redirect_uri=${redirectUrlEncoded}`;

        if (oAuthUrlLoginUrl) {
          this.setState({
            isLoading: false,
            oAuthLoginUrl: oAuthUrlLoginUrl
          });
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

  public render() {
    const { isLoading, error, oAuthLoginUrl } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (!isLoading && oAuthLoginUrl) {
      return (
        <React.Fragment>
          <div>
            <BrowserRouter>
              <Route>
                <Redirect
                  to={{
                    pathname: window.location.href = oAuthLoginUrl
                  }}
                />
              </Route>
            </BrowserRouter>
          </div>
        </React.Fragment>
      );
    }

    return <h3>Loading...</h3>;
  }
}

export default RedirectToTokenIssuer;
