import React from 'react';
import { Query } from 'react-apollo';
import { LibraryNodeButton } from 'src/components';
import { GET_NODES } from 'src/components/libraryNodes/queries';
import { INodesQueryVariables } from 'src/types';
import { getColor } from 'src/utils';
import styled from 'styled-components';

export type ILibraryNodesProps = INodesQueryVariables;

const SelectedNodes = styled.ul`
  list-style: none;
  padding: 0.25em;
  border: 2px dashed ${getColor('gray', 'gray5')};
`;

const LibraryNodes: React.SFC<ILibraryNodesProps> = ({
  isSelected,
  nodeLocation,
  nodeType
}) => (
  <Query
    query={GET_NODES}
    variables={{
      isSelected,
      nodeLocation,
      nodeType
    }}
  >
    {nodesQuery => {
      if (nodesQuery.loading) {
        return 'Loading...';
      }

      if (nodesQuery.error) {
        return `Error! ${nodesQuery.error.message}`;
      }

      const nodes = nodesQuery.data.nodes.map((node: any, i: string) => (
        <LibraryNodeButton
          key={i}
          nodeType={node.nodeType}
          name={node.name}
          // tslint:disable-next-line:no-console
          onClick={console.log}
          isSelected={node.isSelected}
        />
      ));

      if (isSelected) {
        return <SelectedNodes>{nodes}</SelectedNodes>;
      } else {
        return <ul>{nodes}</ul>;
      }
    }}
  </Query>
);

export default LibraryNodes;
