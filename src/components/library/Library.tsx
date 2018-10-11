import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Button, LibraryNodes, Section, Text } from 'src/components';
import {
  GET_NODES_FILTERS,
  UPDATE_NODES_FILTERS
} from 'src/components/library/queries';
import { sectionPadding } from 'src/components/section/Section';
import styled from 'styled-components';

const nodeLocations = [
  {
    title: 'Local',
    value: 'local'
  },
  {
    title: 'Network',
    value: 'network'
  }
];

const nodeTypes = [
  {
    title: 'All',
    value: 'all'
  },
  {
    title: 'Things',
    value: 'thing'
  },
  {
    title: 'Actions',
    value: 'action'
  }
];

const NodeContainer = styled.div`
  max-height: 25vh;
  padding: ${sectionPadding};
  overflow: scroll;
`;

class Library extends React.Component<any, any> {
  public render() {
    return (
      <Section title="Library">
        <Query query={GET_NODES_FILTERS}>
          {nodesFiltersQuery => {
            if (nodesFiltersQuery.loading) {
              return 'Loading...';
            }

            if (nodesFiltersQuery.error) {
              return `Error! ${nodesFiltersQuery.error.message}`;
            }

            const selectedNodeLocation =
              nodesFiltersQuery.data.nodesFilters.nodeLocation;
            const selectedNodeType =
              nodesFiltersQuery.data.nodesFilters.nodeType;

            return (
              <React.Fragment>
                <Text>Searchbar</Text>
                <div>
                  {nodeLocations.map((nodeLocation, i) => (
                    <Mutation
                      key={i}
                      mutation={UPDATE_NODES_FILTERS}
                      variables={{ nodeLocation: nodeLocation.value }}
                    >
                      {updateNodesFilters => (
                        <Button
                          title={nodeLocation.title}
                          isSelected={
                            nodeLocation.value === selectedNodeLocation
                          }
                          onClick={updateNodesFilters}
                          value={nodeLocation.value}
                        />
                      )}
                    </Mutation>
                  ))}

                  {nodeTypes.map((nodeType, i) => (
                    <Mutation
                      key={i}
                      mutation={UPDATE_NODES_FILTERS}
                      variables={{ nodeType: nodeType.value }}
                    >
                      {updateNodesFilters => (
                        <Button
                          key={i}
                          title={nodeType.title}
                          isSelected={nodeType.value === selectedNodeType}
                          onClick={updateNodesFilters}
                          value={nodeType.value}
                        />
                      )}
                    </Mutation>
                  ))}
                </div>

                <NodeContainer>
                  <Text>In playground</Text>
                  <LibraryNodes
                    isSelected={true}
                    nodeLocation={selectedNodeLocation}
                    nodeType={selectedNodeType}
                  />
                  <LibraryNodes
                    isSelected={false}
                    nodeLocation={selectedNodeLocation}
                    nodeType={selectedNodeType}
                  />
                </NodeContainer>
              </React.Fragment>
            );
          }}
        </Query>
      </Section>
    );
  }
}

export default Library;
