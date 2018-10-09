import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { Button, Section, Text } from 'src/components';
import { ThingIcon } from 'src/components/icons';
import { sectionPadding } from 'src/components/section/Section';
import { getColor } from 'src/utils';
import styled from 'styled-components';

export type Location = 'local' | 'network';
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

const GET_NODES = gql`
  {
    getNodes @client {
      name
      nodeType
    }
  }
`;

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
        {nodeType === 'action' && <ThingIcon width="20px" color="vividPink" />}
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
          <Query
            query={GET_NODES}
            variables={{ location: 'local', nodeType: 'thing' }}
          >
            {nodeQuery => {
              if (nodeQuery.loading) {
                return 'Loading...';
              }

              if (nodeQuery.error) {
                return `Error! ${nodeQuery.error.message}`;
              }

              return (
                <React.Fragment>
                  <SelectedNodes>
                    {nodeQuery.data.getNodes
                      .filter((node: any) => node.isSelected)
                      .map((node: any, i: string) => (
                        <LibraryNode
                          key={i}
                          nodeType={node.nodeType}
                          name={node.name}
                          onClick={this.selectNode.bind(null, node.name)}
                          isSelected={node.isSelected}
                        />
                      ))}
                  </SelectedNodes>

                  <ul>
                    {nodeQuery.data.getNodes
                      .filter((node: any) => !node.isSelected)
                      .map((node: any, i: string) => (
                        <LibraryNode
                          key={i}
                          nodeType={node.nodeType}
                          name={node.name}
                          onClick={this.selectNode.bind(null, node.name)}
                          isSelected={node.isSelected}
                        />
                      ))}
                  </ul>
                </React.Fragment>
              );
            }}
          </Query>
        </NodeContainer>
      </Section>
    );
  }
}

export default Library;
