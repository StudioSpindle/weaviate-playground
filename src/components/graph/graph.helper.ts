import {
  forceManyBody as d3ForceManyBody,
  forceSimulation as d3ForceSimulation,
  forceX as d3ForceX,
  forceY as d3ForceY,
  Simulation
} from 'd3-force';
import ERRORS from '../err';
import utils from '../utils';
import { computeNodeDegree } from './collapse.helper';
import { IGraphProps, IGraphState } from './Graph';
import DEFAULT_CONFIG from './graph.config';
import CONST from './graph.const';
import {
  IGraphConfig,
  IGraphD3Link,
  IGraphD3Node,
  IGraphD3Nodes,
  IGraphLink,
  IGraphLinksMatrix,
  IGraphNodesMatrix
} from './types';

const NODE_PROPS_WHITELIST = [
  'id',
  'highlighted',
  'x',
  'y',
  'index',
  'vy',
  'vx'
];

/**
 * Create d3 forceSimulation to be applied on the graph.<br/>
 */
const createForceSimulation = (
  width: number,
  height: number,
  gravity: number
): Simulation<any, any> => {
  const frx = d3ForceX(width / 2).strength(CONST.FORCE_X);
  const fry = d3ForceY(height / 2).strength(CONST.FORCE_Y);
  const forceStrength = gravity;

  return d3ForceSimulation()
    .force('charge', d3ForceManyBody().strength(forceStrength))
    .force('x', frx)
    .force('y', fry);
};

/**
 * Receives a matrix of the graph with the links source and target as concrete node instances and it transforms it
 * in a lightweight matrix containing only links with source and target being strings representative of some node id
 * and the respective link value (if non existent will default to 1).
 * @param  {Array.<Link>} graphLinks - an array of all graph links.
 */
const initializeLinks = (
  graphLinks: any[],
  config: IGraphConfig
): IGraphLinksMatrix[] => {
  return graphLinks.reduce((links, l) => {
    const source =
      l.source.id !== undefined && l.source.id !== null
        ? l.source.id
        : l.source;
    const target =
      l.target.id !== undefined && l.target.id !== null
        ? l.target.id
        : l.target;

    if (!links[source]) {
      links[source] = {};
    }

    if (!links[target]) {
      links[target] = {};
    }

    const value = config.collapsible && l.isHidden ? 0 : l.value || 1;

    links[source][target] = value;

    if (!config.directed) {
      links[target][source] = value;
    }

    return links;
  }, {});
};

/**
 * Method that initialize graph nodes provided by rd3g consumer and adds additional default mandatory properties
 * that are optional for the user. Also it generates an index mapping, this maps nodes ids the their index in the array
 * of nodes. This is needed because d3 callbacks such as node click and link click return the index of the node.
 */
const initializeNodes = (graphNodes: IGraphD3Nodes): IGraphNodesMatrix => {
  const nodes = {};
  const n = graphNodes.length;

  for (let i = 0; i < n; i++) {
    const node = graphNodes[i];

    node.highlighted = false;

    if (!node.hasOwnProperty('x')) {
      node.x = 0;
    }
    if (!node.hasOwnProperty('y')) {
      node.y = 0;
    }

    nodes[node.id.toString()] = node;
  }

  return nodes;
};

/**
 * Maps an input link (with format `{ source: 'sourceId', target: 'targetId' }`) to a d3Link
 * (with format `{ source: { id: 'sourceId' }, target: { id: 'targetId' } }`). If d3Link with
 * given index exists already that same d3Link is returned.
 */
const mapDataLinkToD3Link = (link: IGraphLink, index: number): IGraphD3Link => {
  const highlighted = false;
  const source = {
    highlighted,
    id: link.source
  };
  const target = {
    highlighted,
    id: link.target
  };

  return {
    id: `${link.source}-${link.target}-${link.value}`,
    index,
    isActive: link.isActive,
    source,
    target,
    value: link.value
  };
};

/**
 * Tags orphan nodes with a `_orphan` flag.
 */
const tagOrphanNodes = (
  nodes: IGraphNodesMatrix,
  linksMatrix: IGraphLinksMatrix
): IGraphNodesMatrix => {
  return Object.keys(nodes).reduce((acc, nodeId) => {
    const { inDegree, outDegree } = computeNodeDegree(nodeId, linksMatrix);
    const node = nodes[nodeId];
    const taggedNode =
      inDegree === 0 && outDegree === 0
        ? {
            ...node,
            _orphan: true
          }
        : node;

    acc[nodeId] = taggedNode;

    return acc;
  }, {});
};

/**
 * Some integrity validations on links and nodes structure. If some validation fails the function will
 * throw an error.
 */
const validateGraphData = (data: IGraphProps['data']): void => {
  if (!data.nodes || !data.nodes.length) {
    utils.throwErr('Graph', ERRORS.INSUFFICIENT_DATA);
  }

  const n = data.links.length;

  for (let i = 0; i < n; i++) {
    const l = data.links[i];

    if (!data.nodes.find(node => node.id === l.source)) {
      utils.throwErr(
        'Graph',
        `${ERRORS.INVALID_LINKS} - "${l.source}" is not a valid source node id`
      );
    }

    if (!data.nodes.find(node => node.id === l.target)) {
      utils.throwErr(
        'Graph',
        `${ERRORS.INVALID_LINKS} - "${l.target}" is not a valid target node id`
      );
    }

    if (
      l &&
      l.value !== undefined &&
      !(typeof l.value === 'number' || typeof l.value === 'string')
    ) {
      utils.throwErr(
        'Graph',
        `${ERRORS.INVALID_LINK_VALUE} - found in link "${
          l.value
        }" with source "${l.source}" and target "${l.target}"`
      );
    }
  }
};

// list of properties that are of no interest when it comes to nodes and links comparison
const NODE_PROPERTIES_DISCARD_TO_COMPARE = ['x', 'y', 'vx', 'vy', 'index'];

/**
 * This function checks for graph elements (nodes and links) changes, in two different
 * levels of significance, updated elements (whether some property has changed in some
 * node or link) and new elements (whether some new elements or added/removed from the graph).
 */
const checkForGraphElementsChanges = (
  nextProps: IGraphProps,
  currentState: IGraphState
): { graphElementsUpdated: any; newGraphElements: any } => {
  const nextNodes = nextProps.data.nodes.map(n =>
    utils.antiPick(n, NODE_PROPERTIES_DISCARD_TO_COMPARE)
  );
  const nextLinks = nextProps.data.links;
  const stateD3Nodes = currentState.d3Nodes.map(n =>
    utils.antiPick(n, NODE_PROPERTIES_DISCARD_TO_COMPARE)
  );
  const stateD3Links = currentState.d3Links.map(l => ({
    // FIXME: solve this source data inconsistency later
    isActive: l.isActive,
    source:
      l.source.id !== undefined && l.source.id !== null
        ? l.source.id
        : l.source,
    target:
      l.target.id !== undefined && l.target.id !== null
        ? l.target.id
        : l.target,
    value: l.value
  }));
  const graphElementsUpdated = !(
    utils.isDeepEqual(nextNodes, stateD3Nodes) &&
    utils.isDeepEqual(nextLinks, stateD3Links)
  );
  const newGraphElements =
    nextNodes.length !== stateD3Nodes.length ||
    nextLinks.length !== stateD3Links.length ||
    !utils.isDeepEqual(
      nextNodes.map(({ id }) => ({
        id
      })),
      stateD3Nodes.map(({ id }) => ({
        id
      }))
    ) ||
    !utils.isDeepEqual(
      nextLinks,
      stateD3Links.map(({ isActive, source, target, value }) => ({
        isActive,
        source,
        target,
        value
      }))
    );

  return {
    graphElementsUpdated,
    newGraphElements
  };
};

/**
 * Logic to check for changes in graph config.
 */
const checkForGraphConfigChanges = (
  nextProps: IGraphProps,
  currentState: IGraphState
): { configUpdated: any; d3ConfigUpdated: any } => {
  const newConfig: Partial<IGraphConfig> = nextProps.config || {};
  const configUpdated =
    newConfig &&
    !utils.isEmptyObject(newConfig) &&
    !utils.isDeepEqual(newConfig, currentState.config);
  const d3ConfigUpdated =
    newConfig &&
    newConfig.d3 &&
    !utils.isDeepEqual(newConfig.d3, currentState.config.d3);

  return {
    configUpdated,
    d3ConfigUpdated
  };
};

/**
 * Returns the transformation to apply in order to center the graph on the
 * selected node.
 */
const getCenterAndZoomTransformation = (
  config: IGraphConfig,
  d3Node?: IGraphD3Node
): string | undefined => {
  if (!d3Node) {
    return;
  }

  const { width, height, focusZoom } = config;

  return `
        translate(${width / 2}, ${height / 2})
        scale(${focusZoom})
        translate(${-d3Node.x}, ${-d3Node.y})
    `;
};

/**
 * Encapsulates common procedures to initialize graph.
 */
const initializeGraphState = (
  { data, id, config }: IGraphProps,
  state: IGraphState
): IGraphState => {
  validateGraphData(data);

  let graph;

  graph = {
    links: data.links.map((l, index) => mapDataLinkToD3Link(l, index)),
    nodes:
      state && state.nodes
        ? data.nodes.map(
            n =>
              state.nodes[n.id]
                ? {
                    ...n,
                    ...utils.pick(state.nodes[n.id], NODE_PROPS_WHITELIST)
                  }
                : n
          )
        : data.nodes
  };

  const newConfig = { ...utils.merge(DEFAULT_CONFIG, config || {}) };
  const links = initializeLinks(graph.links, newConfig); // matrix of graph connections
  const nodes = tagOrphanNodes(initializeNodes(graph.nodes), links);
  const { links: d3Links, nodes: d3Nodes } = graph;
  const formatedId = id.replace(/ /g, '_');
  const simulation = createForceSimulation(
    newConfig.width,
    newConfig.height,
    newConfig.d3 && newConfig.d3.gravity
  );

  const { minZoom, maxZoom, focusZoom } = newConfig;

  if (focusZoom > maxZoom) {
    newConfig.focusZoom = maxZoom;
  } else if (focusZoom < minZoom) {
    newConfig.focusZoom = minZoom;
  }

  return {
    config: newConfig,
    configUpdated: false,
    d3Links,
    d3Nodes,
    highlightedNode: '',
    id: formatedId,
    links,
    newGraphElements: false,
    nodes,
    simulation,
    transform: 1
  };
};

/**
 * This function updates the highlighted value for a given node and also updates highlight props.
 */
const updateNodeHighlightedValue = (
  nodes: IGraphNodesMatrix,
  links: IGraphLinksMatrix,
  config: IGraphConfig,
  id: string,
  value: string | boolean
): { highlightedNode: string; nodes: IGraphNodesMatrix } => {
  const booleanValue = Boolean(value);
  const highlightedNode = booleanValue ? id : '';
  const node = {
    ...nodes[id],
    highlighted: booleanValue
  };
  let updatedNodes = {
    ...nodes,
    [id]: node
  };

  // when highlightDegree is 0 we want only to highlight selected node
  if (links[id] && config.highlightDegree !== 0) {
    updatedNodes = Object.keys(links[id]).reduce((acc, linkId) => {
      const updatedNode = {
        ...updatedNodes[linkId],
        highlighted: booleanValue
      };

      return {
        ...acc,
        [linkId]: updatedNode
      };
    }, updatedNodes);
  }

  return {
    highlightedNode,
    nodes: updatedNodes
  };
};

export {
  checkForGraphConfigChanges,
  checkForGraphElementsChanges,
  getCenterAndZoomTransformation,
  initializeGraphState,
  updateNodeHighlightedValue
};
