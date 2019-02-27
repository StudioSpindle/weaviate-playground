import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
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

/**
 * ClassIntrospector: introspects and stores classes to client
 * classIds are being queried to create the empty slot on the client
 */
const ClassIntrospector: React.SFC = ({ children }) => (
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

            if (!localClassesQuery.data) {
              return (
                <StateMessage
                  state="error"
                  message={translations.defaultError}
                />
              );
            }

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

                  if (!networkClassesQuery.data) {
                    return (
                      <StateMessage
                        state="error"
                        message={translations.defaultError}
                      />
                    );
                  }

                  networkClassesQuery.data.__type.fields.forEach(
                    networkGetINSTANCEObj => {
                      const instance = networkGetINSTANCEObj.name;
                      networkGetINSTANCEObj.type.fields.forEach(
                        networkGetINSTANCECLASSTYPEObj => {
                          const classType = networkGetINSTANCECLASSTYPEObj.name;
                          networkGetINSTANCECLASSTYPEObj.type.fields.forEach(
                            CLASS => {
                              /**
                               * Store class information on client
                               */
                              apolloClient.mutate({
                                mutation: UPDATE_CLASS_MUTATION,
                                variables: {
                                  classLocation:
                                    instance === 'Local' ? instance : 'Network',
                                  classType,
                                  filters: '{}',
                                  id: `${instance}-${classType}-${CLASS.name}`,
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

export default ClassIntrospector;
