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
  responseType: string;
}

// this can be made into a JSON file?
const CONFIG: IConfig = {
  clientId: 'demo', // required and client specific
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
    const data: any = await this.fetchRegistrationEndPoint();

    // tslint:disable-next-line:no-console
    console.log('data', data);
  }

  public fetchRegistrationEndPoint() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const uri = urlSearchParams.get('weaviateUri') || '';
    const currentUrl = uri.replace('graphql', '');

    const apiUrl = currentUrl + '.well-known/openid-configuration';

    fetch(apiUrl, {})
      .then(async res => {
        if (res.ok) {
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

    return (
      <React.Fragment>
        {error ? <p>{error.message}</p> : null}
        {!isLoading && endPoint ? (
          <div>
            <BrowserRouter>
              <Route>
                <Redirect
                  to={(window.location.href = this.createTokenRequestUrl())}
                />
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
