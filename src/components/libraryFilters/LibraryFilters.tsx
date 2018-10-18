import * as React from 'react';
import { Button } from 'src/components';
import {
  ActionIcon,
  LocalIcon,
  NetworkIcon,
  ThingIcon
} from 'src/components/icons';
import {
  UPDATE_NODES_FILTERS,
  UpdateNodesFiltersMutation
} from 'src/components/library/queries';
import { NodeLocation, NodeType } from 'src/types';
import { Color } from 'src/utils/getColor';
import styled from 'styled-components';

/**
 * Types
 */
export interface ILibraryFiltersProps {
  selectedNodeLocation: NodeLocation;
  selectedNodeType: NodeType;
}

interface INodeLocations {
  local: NodeLocation;
  network: NodeLocation;
}

interface INodeTypes {
  all: NodeType;
  things: NodeType;
  actions: NodeType;
}

/**
 * Statics
 */
export const nodeLocations: INodeLocations = {
  local: 'Local',
  network: 'Network'
};

export const nodeTypes: INodeTypes = {
  all: 'All',
  things: 'Things',
  // tslint:disable-next-line:object-literal-sort-keys
  actions: 'Actions'
};

/**
 * Styled components
 */
const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LibraryFilterSection = styled.div`
  display: flex;
`;

const getIcon = (value: NodeLocation | NodeType, isSelected: boolean) => {
  const iconSize = 15;
  const props = {
    color: isSelected ? 'white' : ('almostBlack' as Color),
    height: iconSize + 'px',
    isFilled: true,
    width: iconSize + 'px'
  };
  switch (value) {
    case nodeLocations.local:
      return <LocalIcon {...props} />;
    case nodeLocations.network:
      return <NetworkIcon {...props} />;
    case nodeTypes.actions:
      return <ActionIcon {...props} />;
    case nodeTypes.things:
      return <ThingIcon {...props} />;
    default:
      return undefined;
  }
};

/**
 * Library filters component: renders filters for seaching classes in the Library
 */
const LibraryFilters: React.SFC<ILibraryFiltersProps> = ({
  selectedNodeLocation,
  selectedNodeType
}) => (
  <Container>
    <LibraryFilterSection>
      {Object.keys(nodeLocations).map((nodeLocationKey, i) => {
        const nodeLocation: NodeLocation = nodeLocations[nodeLocationKey];
        const isSelected = nodeLocation === selectedNodeLocation;
        return (
          <UpdateNodesFiltersMutation
            key={i}
            mutation={UPDATE_NODES_FILTERS}
            variables={{ nodeLocation }}
          >
            {updateNodesFilters => (
              <Button
                title={nodeLocation}
                icon={getIcon(nodeLocation, isSelected)}
                isSelected={isSelected}
                onClick={updateNodesFilters}
                value={nodeLocation}
              />
            )}
          </UpdateNodesFiltersMutation>
        );
      })}
    </LibraryFilterSection>
    <LibraryFilterSection>
      {Object.keys(nodeTypes).map((nodeTypeKey, i) => {
        const nodeType: NodeType = nodeTypes[nodeTypeKey];
        const isSelected = nodeType === selectedNodeType;
        return (
          <UpdateNodesFiltersMutation
            key={i}
            mutation={UPDATE_NODES_FILTERS}
            variables={{ nodeType }}
          >
            {updateNodesFilters => (
              <Button
                key={i}
                title={nodeType}
                icon={getIcon(nodeType, isSelected)}
                isSelected={isSelected}
                onClick={updateNodesFilters}
                value={nodeType}
              />
            )}
          </UpdateNodesFiltersMutation>
        );
      })}
    </LibraryFilterSection>
  </Container>
);

export default LibraryFilters;
