import React from 'react';
import { Query } from 'react-apollo';
import { Text } from 'src/components';
import {
  ActionIcon,
  AddIcon,
  CheckIcon,
  ThingIcon
} from 'src/components/icons';
import {
  GET_LIBRARY_NODE_BUTTON_QUERY,
  UPDATE_SELECTED_NODES,
  UpdateSelectedNodesMutation
} from 'src/components/libraryNodeButton/queries';
import { NodeType } from 'src/types';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Types
 */
export interface ILibraryNodeProps {
  instance?: string;
  name: string;
  nodeType: NodeType;
  parentTypename: string;
  typename: string;
}

/**
 * Styled components
 */
const Container = styled.button`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
  border: none;
  &:hover {
    background-color: ${getColor('indigo', 'tint-3')};
  }
`;

const IconNameContainer = styled.div`
  display: flex;
`;

const IconContainer = styled.div`
  display: flex;
  margin-left: 1em;
  margin-right: 1em;
`;

const updateSelection = (updateSelectedNodes: any, typename: string) =>
  updateSelectedNodes({ variables: { typename } });

/**
 * LibraryNodeButton component: renders button used for each class in Library
 */
const LibraryNodeButton: React.SFC<ILibraryNodeProps> = ({
  instance,
  name,
  nodeType,
  parentTypename
}: ILibraryNodeProps) => (
  <Query query={GET_LIBRARY_NODE_BUTTON_QUERY} variables={{ typename: name }}>
    {nodeQuery => {
      if (nodeQuery.loading) {
        return (
          <li>
            <Container>
              <div>
                <Text>Loading...</Text>
              </div>
            </Container>
          </li>
        );
      }

      if (nodeQuery.error) {
        return (
          <li>
            <Container>
              <div>
                <Text>${nodeQuery.error.message}</Text>
              </div>
            </Container>
          </li>
        );
      }
      const selectedNodes = nodeQuery.data.canvas.selectedNodes;
      const isSelected = selectedNodes.includes(name);

      const iconSize = 24;
      const iconProps = {
        height: iconSize + 'px',
        isFilled: true,
        width: iconSize + 'px'
      };

      return (
        <UpdateSelectedNodesMutation
          mutation={UPDATE_SELECTED_NODES}
          variables={{ typename: name }}
        >
          {(updateSelectedNodes: any) => (
            <li>
              <Container
                onClick={updateSelection.bind(null, updateSelectedNodes, name)}
              >
                <IconNameContainer>
                  <IconContainer>
                    {nodeType === 'Things' && <ThingIcon {...iconProps} />}
                    {nodeType === 'Actions' && <ActionIcon {...iconProps} />}
                  </IconContainer>
                  <Text fontWeight="bold">{name}</Text>
                </IconNameContainer>

                <IconContainer>
                  {isSelected ? (
                    <CheckIcon width="24px" height="24px" color="vividPink" />
                  ) : (
                    <AddIcon width="24px" height="24px" />
                  )}
                </IconContainer>
              </Container>
            </li>
          )}
        </UpdateSelectedNodesMutation>
      );
    }}
  </Query>
);

export default LibraryNodeButton;
