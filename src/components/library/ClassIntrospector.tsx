import Grid from '@material-ui/core/Grid';
import get from 'get-value';
import jwtDecode from 'jwt-decode';
import React from 'react';
import translations from 'src/translations/en';
import { createApiHeaders } from '../../apis/ApiWeaviate';
import RedirectToTokenIssuer from '../redirectToTokenIssuer/RedirectToTokenIssuer';
import FormAddWeaviateUrl from '../welcomeScreen/FormAddWeaviateUrl';
import WelcomeMessage from '../welcomeScreen/WelcomeMessage';
import ClassFetcher from './ClassFetcher';
import StateMessage from './StateMessage';

// tslint:disable-next-line:no-empty-interface
interface IClassIntrospectorProps {}

interface IClassIntrospectorState {
  empty: boolean;
  error: boolean;
  errorMessage?: string;
  fetchToken: boolean;
  loading: boolean;
}

/**
 * ClassIntrospector: introspects and stores classes to client
 * classIds are being queried to create the empty slot on the client
 */
class ClassIntrospector extends React.Component<
  IClassIntrospectorProps,
  IClassIntrospectorState
> {
  /**
   * Fetches and validates the token from the OAuth provider (note: does not verify)
   * @returns {string} The token
   */
  public static fetchToken(token: string) {
    const tokenDecoded: { nonce: string } = jwtDecode(token);
    /** (Mitigate replay attacks when using the Implicit Flow) */
    if (tokenDecoded.nonce === window.localStorage.getItem('nonce')) {
      // tslint:disable-next-line:no-console
      return token;
    } else {
      /** Nonce is not OK! Token replay attack might be underway */
      // tslint:disable-next-line:no-console
      throw new Error(
        'The nonce of the token does not match with the application.'
      );
    }
  }

  public static getUrlHashParams(search: string): { access_token: string } {
    const hashes = search.slice(search.indexOf('#') + 1).split('&');
    const params: any = {};

    hashes.map(hash => {
      const [key, val] = hash.split('=');
      params[key] = decodeURIComponent(val);
    });

    return params;
  }

  constructor(props: IClassIntrospectorProps) {
    super(props);
    this.state = {
      empty: true,
      error: false,
      fetchToken: false,
      loading: true
    };
  }

  public componentDidMount() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const uri = urlSearchParams.get('weaviateUri') || '';
    const urlGraphQl = uri.replace('graphql', '');

    const urlObject = ClassIntrospector.getUrlHashParams(window.location.href);
    const tokenUnprocessed = urlObject.access_token;

    if (window.localStorage.getItem('jwt-token')) {
      // tslint:disable-next-line:no-console
      console.log(
        'The jwt-token is present in local storage, use the requests with this in the header.'
      );

      this.fetchClasses(urlGraphQl, createApiHeaders());
    } else if (tokenUnprocessed) {
      // tslint:disable-next-line:no-console
      console.log(
        'The jwt-token is not present in local storage, but it is available in the hashed URL. Set that in the local starge and use it in the first request to fetch classes.'
      );

      const processToken: string = ClassIntrospector.fetchToken(
        tokenUnprocessed
      );
      /** store token */
      window.localStorage.setItem('jwt-token', processToken);

      this.fetchClasses(urlGraphQl, createApiHeaders());
    } else {
      // tslint:disable-next-line:no-console
      console.log('No authorization is required...');

      fetch(`${urlGraphQl}meta`)
        .then(res => {
          if (res.status === 401) {
            /** Unauthorized, use JWT */
            // tslint:disable-next-line:no-console
            this.setState({ error: false, loading: false, fetchToken: true });
          }
          if (res.status === 400 || res.status > 401) {
            /** There is something wrong with the URL... */
            this.setState({
              error: true,
              errorMessage: translations.errorWrongUrl,
              loading: false
            });
            throw new Error(translations.errorWrongUrl);
          }
        })
        .then(() => {
          /**
           * fetch the classes without bearer
           */
          this.fetchClasses(urlGraphQl, {});
        })
        .catch(err => {
          this.setState({ error: true, loading: false });
          /** display error message in console */
          // tslint:disable-next-line:no-console
          console.log(err.stack);
        });
    }
  }

  public fetchClasses(url: string, headers: {}) {
    fetch(`${url}meta`, {
      headers: createApiHeaders()
    })
      .then(res => {
        if (res.headers.get('content-type') === 'application/json') {
          return res.json();
        } else {
          throw new Error('The fetch did not return any valid JSON.');
        }
      })
      .then(classSchemasQuery => {
        const actionClasses = get(classSchemasQuery, 'actionSchema.classes');
        const thingsClasses = get(classSchemasQuery, 'thingsSchema.classes');
        const empty =
          !Boolean(actionClasses && actionClasses.length) &&
          !Boolean(thingsClasses && thingsClasses.length);
        this.setState({ error: false, empty, loading: false });
      })
      .catch(err => {
        this.setState({ error: true, loading: false });
        /** display error message in console */
        // tslint:disable-next-line:no-console
        console.log(err.stack);
      });
  }

  public render() {
    const { empty, error, loading, errorMessage, fetchToken } = this.state;
    const { children } = this.props;
    if (loading) {
      return (
        <Grid
          container={true}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <WelcomeMessage />
          <StateMessage
            state="loading"
            message={translations.loadingLocalClasses}
          />
          <FormAddWeaviateUrl />
        </Grid>
      );
    } else if (fetchToken && error) {
      return (
        <Grid
          container={true}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <WelcomeMessage />
          <StateMessage state="error" message={errorMessage} />
          <RedirectToTokenIssuer />
          <FormAddWeaviateUrl />
        </Grid>
      );
    } else if (error) {
      return (
        <Grid
          container={true}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <WelcomeMessage />
          <StateMessage state="error" message={errorMessage} />
          <FormAddWeaviateUrl />
        </Grid>
      );
    }

    return <ClassFetcher isWeaviateEmpty={empty} children={children} />;
  }
}

export default ClassIntrospector;
