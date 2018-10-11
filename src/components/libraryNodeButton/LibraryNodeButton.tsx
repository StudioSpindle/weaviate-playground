import React from 'react';
import { Text } from 'src/components';
import { ActionIcon, ThingIcon } from 'src/components/icons';
import { NodeType } from 'src/types';
import styled from 'styled-components';

export interface ILibraryNodeProps {
  isSelected?: boolean;
  name: string;
  nodeType: NodeType;
  onClick: (value: any) => void;
}

const Container = styled.button`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: none;
`;

const LibraryNodeButton: React.SFC<ILibraryNodeProps> = ({
  isSelected,
  name,
  nodeType,
  onClick
}: ILibraryNodeProps) => (
  <li>
    <Container onClick={onClick}>
      <div>
        {nodeType === 'thing' && <ThingIcon width="24px" isFilled={true} />}
        {nodeType === 'action' && <ActionIcon width="24px" isFilled={true} />}
        <Text>{name}</Text>
      </div>
      <Text>{isSelected ? 'isSelected' : 'add'}</Text>
    </Container>
  </li>
);

export default LibraryNodeButton;
