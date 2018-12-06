import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import apolloClient from 'src/apolloClient';
import translations from 'src/translations/en';
import {
  GET_LOCAL_CLASSES,
  GET_NETWORK_CLASSES,
  GetLocalClassesQuery,
  GetNetworkClassesQuery,
  UPDATE_CLASS_MUTATION
} from './queries';

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
    {message && (
      <Typography color={state === 'error' ? state : undefined}>
        {message}
      </Typography>
    )}
  </Grid>
);

/**
 * ClassIntrospector: introspects and stores classes to client
 * classIds are being queried to create the empty slot on the client
 */
const ClassIntrospector: React.SFC = ({ children }) => (
  <Query
    query={gql`
      query classIds {
        canvas @client {
          classIds
        }
      }
    `}
  >
    {(query: any) => {
      return (
        <GetLocalClassesQuery
          query={GET_LOCAL_CLASSES}
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
              <GetNetworkClassesQuery
                query={GET_NETWORK_CLASSES}
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
              </GetNetworkClassesQuery>
            );
          }}
        </GetLocalClassesQuery>
      );
    }}
  </Query>
);

export default ClassIntrospector;
