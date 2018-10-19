import * as React from 'react';
import {
  LibraryFilters,
  LibraryNodes,
  LibraryNodeSelection,
  LibraryTextSearch,
  Section
} from 'src/components';
import {
  GET_NODES_FILTERS,
  GET_SELECTED_NODES,
  GetNodesFiltersQuery,
  GetSelectedNodesQuery
} from 'src/components/library/queries';
import styled from 'styled-components';

/**
 * Styled components
 */
const NodeContainer = styled.div`
  max-height: 25vh;
  overflow: scroll;
`;

/**
 * Library component: renders node selection with filter options
 */
const Library = () => (
  <Section title="Library">
    <GetNodesFiltersQuery query={GET_NODES_FILTERS}>
      {nodesFiltersQuery => {
        if (nodesFiltersQuery.loading) {
          return 'Loading...';
        }

        if (nodesFiltersQuery.error) {
          return `Error! ${nodesFiltersQuery.error.message}`;
        }

        if (!nodesFiltersQuery.data) {
          // TODO: Replace with proper message
          return null;
        }

        const selectedNodeLocation =
          nodesFiltersQuery.data.nodesFilters.nodeLocation;
        const selectedNodeType = nodesFiltersQuery.data.nodesFilters.nodeType;
        const queryString = nodesFiltersQuery.data.nodesFilters.queryString;

        return (
          <React.Fragment>
            <LibraryTextSearch />
            <LibraryFilters
              selectedNodeLocation={selectedNodeLocation}
              selectedNodeType={selectedNodeType}
            />

            <GetSelectedNodesQuery query={GET_SELECTED_NODES}>
              {selectedNodesQuery => {
                if (selectedNodesQuery.loading) {
                  return 'Loading...';
                }

                if (selectedNodesQuery.error) {
                  return `Error! ${selectedNodesQuery.error.message}`;
                }

                if (!selectedNodesQuery.data) {
                  // TODO: Replace with proper message
                  return null;
                }
                const selectedNodes =
                  selectedNodesQuery.data.canvas.selectedNodes;
                return (
                  <NodeContainer>
                    <LibraryNodeSelection selectedNodes={selectedNodes} />
                    <LibraryNodes
                      isSelected={false}
                      nodeLocation={selectedNodeLocation}
                      nodeType={selectedNodeType}
                      queryString={queryString}
                      selectedNodes={selectedNodes}
                    />
                  </NodeContainer>
                );
              }}
            </GetSelectedNodesQuery>
          </React.Fragment>
        );
      }}
    </GetNodesFiltersQuery>
  </Section>
);

export default Library;
