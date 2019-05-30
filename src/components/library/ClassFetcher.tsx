import React from 'react';
import apolloClient from '../../apollo/apolloClient';
import translations from '../../translations/en';
import {
  CLASS_IDS_QUERY,
  ClassIdsQuery,
  LOCAL_CLASSES_QUERY,
  LocalClassesQuery,
  NETWORK_CLASSES_QUERY,
  NetworkClassesQuery,
  UPDATE_CLASS_MUTATION
} from '../introspection/queries';

interface IClassFetcherProps {
  isWeaviateEmpty: boolean;
  children: any;
}

import StateMessage from './StateMessage';

class ClassFetcher extends React.Component<IClassFetcherProps> {
  constructor(props: IClassFetcherProps) {
    super(props);
  }

  public render() {
    const isWeaviateEmpty = this.props.isWeaviateEmpty;
    const children = this.props.children;

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
  }
}

export default ClassFetcher;
