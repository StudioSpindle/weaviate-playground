import Grid from '@material-ui/core/Grid';
import get from 'get-value';
import React from 'react';
import translations from 'src/translations/en';
import FormAddWeaviateUrl from '../welcomeScreen/FormAddWeaviateUrl';
import WelcomeMessage from '../welcomeScreen/WelcomeMessage';
import ClassFetcher from './ClassFetcher';
import StateMessage from './StateMessage';

// tslint:disable-next-line:no-empty-interface
interface IClassIntrospectorProps {}

interface IClassIntrospectorState {
  empty: boolean;
  error: boolean;
  loading: boolean;
  errorMessage?: string;
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
      loading: true
    };
  }

  public componentDidMount() {
    this.fetchClasses();
  }

  // TODO: Make the fetch only happen when the form is submitted, or when in the application itself
  //  (not on the homepage of the app)
  public fetchClasses() {
    const urlParams = new URLSearchParams(window.location.search);
    const uri = urlParams.get('weaviateUri') || '';
    const url = uri.replace('graphql', '');

    fetch(`${url}meta`)
      .then(res => {
        if (res.status === 401) {
          this.setState({
            error: true,
            loading: false,
            errorMessage: translations.errorAnonymousAccess
          });
          throw new Error(translations.errorAnonymousAccess);
        } else if (res.status === 400 || res.status > 401) {
          this.setState({
            error: true,
            loading: false,
            errorMessage: translations.errorWrongUrl
          });
          throw new Error(translations.errorWrongUrl);
        } else if (res.headers.get('content-type') === 'application/json') {
          /** Good, this means the  response is JSON output which we expect from the query */
          return res.json();
        } else {
          /** Bad, the response should be valid JSON */
          throw new Error('The fetch did not return valid JSON.');
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
        /** use error message in UI */
        this.setState({ error: true, loading: false });
        /** display error message in console */
        // tslint:disable-next-line:no-console
        console.log(err.stack);
      });
  }

  public render() {
    const { empty, error, loading, errorMessage } = this.state;
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
