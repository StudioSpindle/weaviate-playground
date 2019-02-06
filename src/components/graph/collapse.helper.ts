import {
  IGraphConfig,
  IGraphD3Links,
  IGraphLeafConnections,
  IGraphLinksMatrix,
  IGraphNode,
  IGraphNodesMatrix
} from './types';

/**
 * @module Graph/collapse-helper
 * @description
 * Offers a series of methods that allow graph to perform the necessary operations to
 * create the collapsible behavior.
 *
 * Developer notes - collapsing nodes and maintaining state on links matrix.
 *
 * User interaction flow (for a collapsible graph)
 * 1. User clicks node
 * 2. All leaf connections of that node are not rendered anymore
 * 3. User clicks on same node
 * 4. All leaf connections of that node are rendered
 *
 * Internal react-d3-graph flow
 * 1. User clicks node
 * 2. Compute leaf connections for clicked node (rootNode, root as in 'root' of the event)
 * 3. Update connections matrix (based on 2.)
 * 4. Update d3Links array with toggled connections (based on 2.)
 */

/**
 * For directed graphs. Check based on node degrees whether it is a leaf node or not.
 */
const isLeafDirected = (inDegree: number, outDegree: number): boolean =>
  inDegree <= 1 && outDegree < 1;

/**
 * For not directed graphs. Check based on node degrees whether it is a leaf node or not.
 */
const isLeafNotDirected = (inDegree: number, outDegree: number): boolean =>
  inDegree <= 1 && outDegree <= 1;

/**
 * Given in and out degree tells whether degrees indicate a leaf or non leaf scenario.
 */
const isLeaf = (
  nodeId: IGraphNode['id'],
  linksMatrix: IGraphLinksMatrix,
  directed: IGraphConfig['directed']
): boolean => {
  const { inDegree, outDegree } = computeNodeDegree(nodeId, linksMatrix);

  return directed
    ? isLeafDirected(inDegree, outDegree)
    : isLeafNotDirected(inDegree, outDegree);
};

/**
 * Calculates degree (in and out) of some provided node.
 */
const computeNodeDegree = (
  nodeId: IGraphNode['id'],
  linksMatrix: IGraphLinksMatrix
): { inDegree: number; outDegree: number } => {
  return Object.keys(linksMatrix).reduce(
    (acc, source) => {
      if (!linksMatrix[source]) {
        return acc;
      }

      const currentNodeConnections = Object.keys(linksMatrix[source]);

      return currentNodeConnections.reduce((newAcc, target) => {
        if (nodeId === source) {
          return {
            ...newAcc,
            outDegree: newAcc.outDegree + linksMatrix[nodeId][target]
          };
        }

        if (nodeId === target) {
          return {
            ...newAcc,
            inDegree: newAcc.inDegree + linksMatrix[source][nodeId]
          };
        }

        return newAcc;
      }, acc);
    },
    {
      inDegree: 0,
      outDegree: 0
    }
  );
};

/**
 * Given a node id we want to calculate the list of leaf connections
 * What is a leaf connection? A leaf connection is a link between some node A and other node B
 * where A has id equal to rootNodeId and B has inDegree 1 and outDegree 0 (or outDegree 1 but the connection is with A).
 */
const getTargetLeafConnections = (
  rootNodeId: IGraphNode['id'],
  linksMatrix: IGraphLinksMatrix,
  { directed }: { directed: IGraphConfig['directed'] }
): IGraphLeafConnections => {
  const rootConnectionsNodesIds = Object.keys(linksMatrix[rootNodeId]);

  return rootConnectionsNodesIds.reduce(
    (leafConnections: IGraphLeafConnections, target) => {
      if (isLeaf(target, linksMatrix, directed)) {
        leafConnections.push({
          isActive: false,
          source: rootNodeId,
          target
        });
      }

      return leafConnections;
    },
    []
  );
};

/**
 * Given a node and the connections matrix, check if node should be displayed
 * NOTE: this function is meant to be used under the `collapsible` toggle, meaning
 * that the `isNodeVisible` actually is checking visibility on collapsible graphs.
 * If you think that this code is confusing and could potentially collide (🤞) with #_isLeaf
 * always remember that *A leaf can, through time, be both a visible or an invisible node!*.
 */
const isNodeVisible = (
  nodeId: IGraphNode['id'],
  nodes: IGraphNodesMatrix,
  linksMatrix: IGraphLinksMatrix
): boolean => {
  const { inDegree, outDegree } = computeNodeDegree(nodeId, linksMatrix);
  const orphan = !!nodes[nodeId]._orphan;

  return inDegree > 0 || outDegree > 0 || orphan;
};

/**
 * Updates d3Links by toggling given connections
 */
const toggleLinksConnections = (
  d3Links: IGraphD3Links,
  linksMatrix: IGraphLinksMatrix
): IGraphD3Links => {
  return d3Links.map(d3Link => {
    const { source, target } = d3Link;
    const sourceId = source.id;
    const targetId = target.id;
    // connectionMatrix[sourceId][targetId] can be 0 or non existent
    const connection =
      linksMatrix && linksMatrix[sourceId] && linksMatrix[sourceId][targetId];

    return connection
      ? {
          ...d3Link,
          isHidden: false
        }
      : {
          ...d3Link,
          isHidden: true
        };
  });
};

/**
 * Update matrix given array of connections to toggle.
 */
const toggleLinksMatrixConnections = (
  linksMatrix: IGraphLinksMatrix,
  leafConnections: IGraphLeafConnections,
  { directed }: { directed: IGraphConfig['directed'] }
): IGraphLinksMatrix => {
  return leafConnections.reduce(
    (newMatrix: IGraphLinksMatrix, link) => {
      if (!newMatrix[link.source]) {
        newMatrix[link.source] = {};
      }

      if (!newMatrix[link.source][link.target]) {
        newMatrix[link.source][link.target] = 0;
      }

      const newConnectionValue =
        newMatrix[link.source][link.target] === 0 ? 1 : 0;

      newMatrix[link.source][link.target] = newConnectionValue;

      if (!directed) {
        newMatrix[link.target][link.source] = newConnectionValue;
      }

      return newMatrix;
    },
    {
      ...linksMatrix
    }
  );
};

export {
  computeNodeDegree,
  getTargetLeafConnections,
  isNodeVisible,
  toggleLinksConnections,
  toggleLinksMatrixConnections
};
