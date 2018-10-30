import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import apolloClient from 'src/apolloClient';
import {
  GET_LOCAL_CLASSES,
  GET_NETWORK_CLASSES,
  GetLocalClassesQuery,
  GetNetworkClassesQuery,
  UPDATE_CLASS_MUTATION
} from './queries';

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
              return <p>Loading local classes</p>;
            }

            if (localClassesQuery.error) {
              return null;
            }

            if (!localClassesQuery.data) {
              return null;
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
                    return <p>Loading network classes</p>;
                  }
                  if (networkClassesQuery.error) {
                    return null;
                  }

                  if (!networkClassesQuery.data) {
                    return null;
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
