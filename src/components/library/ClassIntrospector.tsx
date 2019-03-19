import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import get from 'get-value';
import gql from 'graphql-tag';
import React from 'react';
import apolloClient from 'src/apollo/apolloClient';
import client from 'src/apollo/apolloClient';
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

// tslint:disable-next-line:no-empty-interface
interface IClassIntrospectorProps {}

interface IClassIntrospectorState {
  empty: boolean;
  error: boolean;
  loading: boolean;
}

const StateMessage = ({
  message,
  state
}: {
  message?: string;
  state: 'error' | 'loading';
}) => (
  <Grid
    container={true}
    direction="column"
    justify="center"
    alignItems="center"
  >
    {state === 'loading' && <CircularProgress />}
    {state === 'error' && (
      <React.Fragment>
        <Typography component="h1" variant="h1">
          Welcome to the Weaviate-Playground!
        </Typography>
        <Typography>
          This is the GUI on top of the decentralised knowledge graph{' '}
          <a
            href="https://github.com/creativesoftwarefdn/weaviate"
            target="_blank"
          >
            Weaviate
          </a>
          . For more information or documentation visit the Weaviate Playground{' '}
          <a
            href="https://github.com/creativesoftwarefdn/weaviate/blob/develop/docs/en/use/weaviate-playground.md"
            target="_blank"
          >
            documentation
          </a>{' '}
          on Github.
        </Typography>
        {message && <Typography color="error">{message}</Typography>}
        <form>
          <FormControl margin="normal" required={true} fullWidth={true}>
            <InputLabel htmlFor="weaviateUri">Weaviate URL</InputLabel>
            <Input
              name="weaviateUri"
              type="text"
              id="weaviateUri"
              autoComplete="weaviateUri"
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            color="primary"
            size="small"
          >
            Connect Weaviate
          </Button>
        </form>
      </React.Fragment>
    )}
  </Grid>
);

const ClassFetcher: React.SFC = ({ children }) => (
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

  public fetchClasses() {
    // TODO: Remove RESTful request when integrated in GraphQL
    const query = gql`
      query classSchemas {
        classSchemas @rest(type: "ClassSchemas", path: "meta") {
          actionSchema
          thingsSchema
        }
      }
    `;

    client
      .query({ query })
      .then(classSchemasQuery => {
        const actionClasses = get(
          classSchemasQuery,
          'data.classSchemas.actionSchema.classes'
        );
        const thingsClasses = get(
          classSchemasQuery,
          'data.classSchemas.thingsSchema.classes'
        );
        const empty =
          !Boolean(actionClasses && actionClasses.length) &&
          !Boolean(thingsClasses && thingsClasses.length);
        this.setState({ error: false, empty, loading: false });
      })
      .catch(err => {
        this.setState({ error: true, loading: false });
      });
  }

  public render() {
    const { empty, error, loading } = this.state;
    const { children } = this.props;
    if (loading) {
      return (
        <StateMessage
          state="loading"
          message={translations.loadingLocalClasses}
        />
      );
    } else if (error) {
      return (
        <StateMessage
          state="error"
          message="The provided url doesn't provide access to a Weaviate instance."
        />
      );
    } else if (empty) {
      return (
        <StateMessage
          state="error"
          message="The provided Weaviate instance is empty."
        />
      );
    }

    return <ClassFetcher children={children} />;
  }
}

export default ClassIntrospector;
