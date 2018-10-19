import * as React from 'react';
import { LibraryNodeButton, Text } from 'src/components';
import { sectionPadding } from 'src/components/section/Section';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Types
 */
export interface ILibraryNodeSelection {
  selectedNodes: string[];
}

/**
 * Styled components
 */
const Container = styled.div`
  padding: ${sectionPadding};
`;

const SelectedNodes = styled.ul`
  list-style: none;
  padding: 0.25em;
  border: 2px dashed ${getColor('gray', 'gray5')};
`;

const NoNodesContainer = styled.div`
  padding: 0.5em 1em;
`;

/**
 * LibraryNodeSelection: renders selected nodes in Library
 */
const LibraryNodeSelection: React.SFC<ILibraryNodeSelection> = ({
  selectedNodes
}) => (
  <Container>
    <Text fontWeight="bold">In playground</Text>
    <SelectedNodes>
      {!selectedNodes.length && (
        <NoNodesContainer>
          <Text color="gray" colorVariant="gray4">
            No active nodes in the playground
          </Text>
        </NoNodesContainer>
      )}
      {selectedNodes.map((node: any, i: number) => (
        <LibraryNodeButton
          key={i}
          name={node}
          nodeType={'Actions'}
          parentTypename={'node.parentTypename'}
          typename={'node.typename'}
        />
      ))}
    </SelectedNodes>
  </Container>
);

export default LibraryNodeSelection;
