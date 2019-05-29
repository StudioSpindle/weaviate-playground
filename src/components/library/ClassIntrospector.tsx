import Grid from '@material-ui/core/Grid';
import get from 'get-value';
import React from 'react';
import apolloClient from 'src/apollo/apolloClient';
import translations from 'src/translations/en';
import {
  CLASS_IDS_QUERY,
  ClassIdsQuery,
  LOCAL_CLASSES_QUERY,
  LocalClassesQuery,
  NETWORK_CLASSES_QUERY,
  NetworkClassesQuery,
  UPDATE_CLASS_MUTATION
} from '../introspection/queries';
import FormAddWeaviateUrl from '../welcomeScreen/FormAddWeaviateUrl';
import WelcomeMessage from '../welcomeScreen/WelcomeMessage';
import StateMessage from './StateMessage';

// tslint:disable-next-line:no-empty-interface
interface IClassIntrospectorProps {}

interface IClassIntrospectorState {
  empty: boolean;
  error: boolean;
  info?: string;
  loading: boolean;
}

interface IClassFetcher {
  isWeaviateEmpty: boolean;
}

const ClassFetcher: React.SFC<IClassFetcher> = ({
  children,
  isWeaviateEmpty
}) => {
  if (isWeaviateEmpty) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <ClassIdsQuery query={CLASS_IDS_QUERY}>
      {classIdsQuery => {
        return (
          <LocalClassesQuery
            query={LOCAL_CLASSES_QUERY}
            variables={{ typename: 'WeaviateLocalGetObj' }}
          >
            {localClassesQuery => {
              if (localClassesQuery.loading) {
                return (
                  <StateMessage
                    state="loading"
                    message={translations.loadingLocalClasses}
                  />
                );
              }

              if (localClassesQuery.error) {
                return (
                  <StateMessage
                    state="error"
                    message={localClassesQuery.error.message}
                  />
                );
              }

              if (localClassesQuery.data && localClassesQuery.data.__type) {
                localClassesQuery.data.__type.fields.forEach(
                  localGetCLASSTYPEObj => {
                    const classType = localGetCLASSTYPEObj.name;
                    localGetCLASSTYPEObj.type.fields.forEach(CLASS => {
                      /**
                       * Store class information on client
                       */
                      apolloClient.mutate({
                        mutation: UPDATE_CLASS_MUTATION,
                        variables: {
                          classLocation: 'Local',
                          classType,
                          filters: '{}',
                          id: `local-${classType}-${CLASS.name}`,
                          instance: 'Local',
                          name: CLASS.name
                        }
                      });
                    });
                  }
                );
              }

              return (
                <NetworkClassesQuery
                  query={NETWORK_CLASSES_QUERY}
                  variables={{ typename: 'WeaviateNetworkGetObj' }}
                >
                  {networkClassesQuery => {
                    if (networkClassesQuery.loading) {
                      return (
                        <StateMessage
                          state="loading"
                          message={translations.loadingNetworkClasses}
                        />
                      );
                    }
                    if (networkClassesQuery.error) {
                      return (
                        <StateMessage
                          state="error"
                          message={translations.defaultError}
                        />
                      );
                    }

                    if (
                      networkClassesQuery.data &&
                      networkClassesQuery.data.__type
                    ) {
                      networkClassesQuery.data.__type.fields.forEach(
                        networkGetINSTANCEObj => {
                          const instance = networkGetINSTANCEObj.name;
                          networkGetINSTANCEObj.type.fields.forEach(
                            networkGetINSTANCECLASSTYPEObj => {
                              const classType =
                                networkGetINSTANCECLASSTYPEObj.name;
                              networkGetINSTANCECLASSTYPEObj.type.fields.forEach(
                                CLASS => {
                                  /**
                                   * Store class information on client
                                   */
                                  apolloClient.mutate({
                                    mutation: UPDATE_CLASS_MUTATION,
                                    variables: {
                                      classLocation:
                                        instance === 'Local'
                                          ? instance
                                          : 'Network',
                                      classType,
                                      filters: '{}',
                                      id: `${instance}-${classType}-${
                                        CLASS.name
                                      }`,
                                      instance,
                                      name: CLASS.name
                                    }
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    }

                    if (
                      (!localClassesQuery.data ||
                        !localClassesQuery.data.__type) &&
                      (!networkClassesQuery.data ||
                        !networkClassesQuery.data.__type)
                    ) {
                      return (
                        <StateMessage
                          state="error"
                          message={translations.defaultError}
                        />
                      );
                    }

                    return children;
                  }}
                </NetworkClassesQuery>
              );
            }}
          </LocalClassesQuery>
        );
      }}
    </ClassIdsQuery>
  );
};

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
      info: '',
      loading: true
    };
  }

  public componentDidMount() {
    this.fetchClasses();
  }

  public fetchClasses() {
    const urlParams = new URLSearchParams(window.location.search);
    const uri = urlParams.get('weaviateUri') || '';
    const url = uri.replace('graphql', '');

    fetch(`${url}meta`)
      .then(res => {
        if (res.status === 401) {
          throw new Error(translations.errorAnonymousAccess);
        } else if (res.status === 400 || res.status > 401) {
          throw new Error('test');
        } else {
          return res.json();
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
        this.setState({ error: true, info: err.message, loading: false });
        /** display error message in console */
        // tslint:disable-next-line:no-console
        console.log(err.stack);
      });
  }

  public render() {
    const { empty, error, loading, info } = this.state;
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
          <StateMessage state="error" message={info} />
          <FormAddWeaviateUrl />
        </Grid>
      );
    }

    return <ClassFetcher isWeaviateEmpty={empty} children={children} />;
  }
}

export default ClassIntrospector;
