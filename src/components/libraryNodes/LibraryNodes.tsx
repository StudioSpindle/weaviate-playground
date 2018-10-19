import React from 'react';
import { LibraryNodeButton } from 'src/components';
import {
  nodeLocations,
  nodeTypes
} from 'src/components/libraryFilters/LibraryFilters';
import {
  GET_LOCAL_NODES,
  GET_NETWORK_NODES,
  GetLocalNodesQuery
} from 'src/components/libraryNodes/queries';
import { INodesQueryVariables, NodeType } from 'src/types';
import { GetNetworkNodesQuery } from './queries/GetNetworkNodes';

/**
 * Types
 */
export interface ILibraryRenderNodesProps {
  nodeType: NodeType;
  nodes: ILibraryNode[];
  queryString: string;
  selectedNodes: string[];
}

export interface ILibraryNodesProps extends INodesQueryVariables {
  isSelected: boolean;
  nodeType: NodeType;
  queryString: string;
  selectedNodes: string[];
}

export interface ILibraryNode {
  instance: string;
  name: string;
  nodeType: NodeType;
  parentTypename: string;
  typename: string;
}

/**
 * Styled components
 */
const filterNodeType = (node: ILibraryNode, nodeType: NodeType) =>
  nodeTypes.all === nodeType || node.nodeType === nodeType;

const filterText = (node: ILibraryNode, text: string) =>
  node.name.toLowerCase().includes(text.toLowerCase());

const isSelected = (node: ILibraryNode, selectedNodes: string[]) =>
  selectedNodes.includes(node.name);

const RenderNodes: React.SFC<ILibraryRenderNodesProps> = ({
  nodeType,
  nodes,
  queryString,
  selectedNodes
}) => (
  <ul>
    {nodes
      .filter(
        node =>
          filterNodeType(node, nodeType) &&
          filterText(node, queryString) &&
          !isSelected(node, selectedNodes)
      )
      .map((node, i) => (
        <LibraryNodeButton
          key={i}
          instance={node.instance}
          name={node.name}
          nodeType={node.nodeType}
          parentTypename={node.parentTypename}
          typename={node.typename}
        />
      ))}
  </ul>
);

/**
 * LibraryNodes: fetches nodes for selection made in Library
 */
const LibraryNodes: React.SFC<ILibraryNodesProps> = ({
  nodeLocation,
  nodeType,
  queryString,
  selectedNodes
}) => {
  if (nodeLocation === nodeLocations.network) {
    return (
      <GetNetworkNodesQuery
        query={GET_NETWORK_NODES}
        variables={{ typename: 'WeaviateNetworkGetObj' }}
      >
        {networkNodes => {
          if (networkNodes.loading) {
            return null;
          }
          if (networkNodes.error) {
            return null;
          }

          if (!networkNodes.data) {
            return null;
          }

          const nodes: ILibraryNode[] = [];

          networkNodes.data.__type.fields.forEach(networkGetINSTANCEObj => {
            const instance = networkGetINSTANCEObj.name;
            networkGetINSTANCEObj.type.fields.forEach(
              networkGetINSTANCENODETYPEObj => {
                const nodeNodeType = networkGetINSTANCENODETYPEObj.name;
                networkGetINSTANCENODETYPEObj.type.fields.forEach(node => {
                  nodes.push({
                    instance,
                    name: node.name,
                    nodeType: nodeNodeType,
                    parentTypename: networkGetINSTANCENODETYPEObj.type.name,
                    typename: node.type.ofType.name
                  });
                });
              }
            );
          });

          return (
            <RenderNodes
              nodeType={nodeType}
              nodes={nodes}
              queryString={queryString}
              selectedNodes={selectedNodes}
            />
          );
        }}
      </GetNetworkNodesQuery>
    );
  }

  return (
    <GetLocalNodesQuery
      query={GET_LOCAL_NODES}
      variables={{ typename: 'WeaviateLocalGetObj' }}
    >
      {localNodes => {
        if (localNodes.loading) {
          return null;
        }
        if (localNodes.error) {
          return null;
        }

        if (!localNodes.data) {
          return null;
        }

        const nodes: ILibraryNode[] = [];

        localNodes.data.__type.fields.forEach(localGetNODETYPEObj => {
          const nodeNodeType = localGetNODETYPEObj.name;
          localGetNODETYPEObj.type.fields.forEach(node => {
            nodes.push({
              instance: 'local',
              name: node.name,
              nodeType: nodeNodeType,
              parentTypename: localGetNODETYPEObj.type.name,
              typename: node.type.ofType.name
            });
          });
        });

        return (
          <RenderNodes
            nodeType={nodeType}
            nodes={nodes}
            queryString={queryString}
            selectedNodes={selectedNodes}
          />
        );
      }}
    </GetLocalNodesQuery>
  );
};

export default LibraryNodes;
