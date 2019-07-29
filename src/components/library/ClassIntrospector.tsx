import Grid from '@material-ui/core/Grid';
import get from 'get-value';
// import jwtDecode from 'jwt-decode';
import React from 'react';
import translations from 'src/translations/en';
import { createApiHeaders } from '../../apis/ApiWeaviate';
import getUrlHashParams from '../../utils/getUrlHashParams';
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

    const urlObject = getUrlHashParams({ url: window.location.href });
    const tokenUnprocessed = urlObject.access_token;

    if (window.localStorage.getItem('token')) {
      // tslint:disable-next-line:no-console
      console.log(
        'The jwt-token is present in local storage, use the requests with this in the header.'
      );

      this.fetchClasses(urlGraphQl, createApiHeaders());
    } else if (tokenUnprocessed) {
      // tslint:disable-next-line:no-console
      console.log(
        'The jwt-token has been added to the local storage, please login again.'
      );

      /** store token */
      window.localStorage.setItem('token', tokenUnprocessed);

      this.fetchClasses(urlGraphQl, createApiHeaders());
    } else {
      // tslint:disable-next-line:no-console
      console.log(
        'No authorization is required... Initial state of the Classintrospector'
      );

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
