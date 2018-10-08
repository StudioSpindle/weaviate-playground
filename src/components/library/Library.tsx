import * as React from 'react';
import { Button, Section, Text } from 'src/components';
import { ThingIcon } from 'src/components/icons';
import { sectionPadding } from 'src/components/section/Section';
import { getColor } from 'src/utils';
import styled from 'styled-components';

const typenameKey = (key: string) => key !== '__typename';
export type NodeType = 'thing' | 'action';

const locations = [
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
    value: 'things'
  },
  {
    title: 'Actions',
    value: 'actions'
  }
];

const NodeContainer = styled.div`
  max-height: 25vh;
  padding: ${sectionPadding};
  overflow: scroll;
`;

const SelectedNodes = styled.ul`
  list-style: none;
  padding: 0.25em;
  border: 2px dashed ${getColor('gray', 'gray5')};
`;

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

const LibraryNode = ({
  isSelected,
  name,
  nodeType,
  onClick
}: ILibraryNodeProps) => (
  <li>
    <Container onClick={onClick}>
      <div>
        {nodeType === 'thing' && <ThingIcon width="20px" />}
        {nodeType === 'action' && <ThingIcon />}
        <Text>{name}</Text>
      </div>
      <Text>{isSelected ? 'isSelected' : 'add'}</Text>
    </Container>
  </li>
);

class Library extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      location: locations[0].value,
      nodeType: nodeTypes[0].value,
      selectedNodes: []
    };
  }

  public setLocation = (location: Location) => {
    this.setState({ location });
  };

  public setNodeType = (nodeType: Location) => {
    this.setState({ nodeType });
  };

  public selectNode = (nodeId: any) => {
    let { selectedNodes } = this.state;
    const isSelected = selectedNodes.includes(nodeId);
    selectedNodes = isSelected
      ? selectedNodes.filter((node: any) => node !== nodeId)
      : [...selectedNodes, nodeId];
    this.setState({ selectedNodes });
  };

  public render() {
    return (
      <Section title="Library">
        <Text>Searchbar</Text>
        <div>
          {locations.map((location, i) => (
            <Button
              key={i}
              title={location.title}
              isSelected={location.value === this.state.location}
              onClick={this.setLocation.bind(null, location.value)}
              value={location.value}
            />
          ))}

          {nodeTypes.map((nodeType, i) => (
            <Button
              key={i}
              title={nodeType.title}
              isSelected={nodeType.value === this.state.nodeType}
              onClick={this.setNodeType.bind(null, nodeType.value)}
              value={nodeType.value}
            />
          ))}
        </div>

        <NodeContainer>
          <Text>In playground</Text>
          <SelectedNodes>
            {Object.keys(this.props.data.Local.Get.Things)
              .filter(
                key =>
                  typenameKey(key) && this.state.selectedNodes.includes(key)
              )
              .map(key => (
                <LibraryNode
                  key={key}
                  nodeType="thing"
                  name={key}
                  onClick={this.selectNode.bind(null, key)}
                  isSelected={true}
                />
              ))}
          </SelectedNodes>

          <ul>
            {Object.keys(this.props.data.Local.Get.Things)
              .filter(
                key =>
                  typenameKey(key) && !this.state.selectedNodes.includes(key)
              )
              .map(key => (
                <LibraryNode
                  key={key}
                  name={key}
                  nodeType="thing"
                  onClick={this.selectNode.bind(null, key)}
                  isSelected={this.state.selectedNodes.includes(key)}
                />
              ))}
          </ul>
        </NodeContainer>
      </Section>
    );
  }
}

export default Library;
