import * as React from 'react';
import { ID3Link, ID3Node } from '../canvas/Canvas';
import Link from '../link/Link';
import Marker from '../marker/Marker';
import { MARKERS } from '../marker/marker.const';
import Node from '../node/Node';
import { isNodeVisible } from './collapse.helper';
import { IGraphConfig } from './Graph';
import { buildLinkProps, buildNodeProps } from './graph.builder';
import CONST from './graph.const';

function renderLinks(
  nodes: ID3Node[],
  links: ID3Link[],
  linksMatrix: Array<{}>,
  config: IGraphConfig,
  linkCallbacks: Array<() => void>,
  highlightedNode: string,
  highlightedLink: {},
  transform: number
) {
  let outLinks = links;

  if (config.collapsible) {
    // @ts-ignore
    outLinks = outLinks.filter(({ isHidden }) => !isHidden);
  }

  return outLinks.map(link => {
    const { source, target, value } = link;
    // @ts-ignore
    const sourceId = typeof source === 'string' ? source : source.id; // source.id;
    // @ts-ignore
    const targetId = typeof source === 'string' ? target : target.id; // target.id;
    const key = `${sourceId}${CONST.COORDS_SEPARATOR}${targetId}`;
    const props = buildLinkProps(
      { ...link, source: `${sourceId}`, target: `${targetId}`, value },
      nodes,
      linksMatrix,
      config,
      linkCallbacks,
      `${highlightedNode}`,
      highlightedLink,
      transform
    );

    return <Link key={key} {...props} />;
  });
}

function renderNodes(
  nodes: ID3Node[],
  nodeCallbacks: Array<() => void>,
  config: IGraphConfig,
  highlightedNode: string,
  highlightedLink: string,
  transform: number,
  linksMatrix: Array<{}>
) {
  let outNodes = Object.keys(nodes);

  if (config.collapsible) {
    outNodes = outNodes.filter(nodeId =>
      // @ts-ignore
      isNodeVisible(nodeId, nodes, linksMatrix)
    );
  }

  return outNodes.map(nodeId => {
    const props = buildNodeProps(
      Object.assign({}, nodes[nodeId], { id: `${nodeId}` }),
      config,
      nodeCallbacks,
      highlightedNode,
      highlightedLink,
      transform
    );

    return <Node key={nodeId} {...props} />;
  });
}

/**
 * Builds graph defs (for now markers, but we could also have gradients for instance).
 * NOTE: defs are static svg graphical objects, thus we only need to render them once, the result
 * is cached on the 1st call and from there we simply return the cached jsx.
 */
function renderDefs() {
  let cachedDefs: JSX.Element;

  return (config: any) => {
    if (cachedDefs) {
      return cachedDefs;
    }

    cachedDefs = (
      <defs>
        <Marker id={MARKERS.MARKER_S} fill={config.link.color} />
        <Marker id={MARKERS.MARKER_SH} fill={config.link.highlightColor} />
        <Marker id={MARKERS.MARKER_M} fill={config.link.color} />
        <Marker id={MARKERS.MARKER_MH} fill={config.link.highlightColor} />
        <Marker id={MARKERS.MARKER_L} fill={config.link.color} />
        <Marker id={MARKERS.MARKER_LH} fill={config.link.highlightColor} />
      </defs>
    );

    return cachedDefs;
  };
}

/**
 * Memoized reference for _renderDefs.
 */
const memoizedRenderDefs = renderDefs();

/**
 * Method that actually is exported an consumed by Graph component in order to build all Nodes and Link
 * components.
 * @param  {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param  {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param  {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param  {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an Object that maps adjacent nodes ids (string) and their values (number).
 * @param  {Function[]} linkCallbacks - array of callbacks for used defined event handler for link interactions.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param  {string} highlightedNode - this value contains a string that represents the some currently highlighted node.
 * @param  {Object} highlightedLink - this object contains a source and target property for a link that is highlighted at some point in time.
 * @param  {string} highlightedLink.source - id of source node for highlighted link.
 * @param  {string} highlightedLink.target - id of target node for highlighted link.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns an object containing the generated nodes and links that form the graph.
 * @memberof Graph/renderer
 */
function renderGraph(
  nodes: ID3Node[],
  nodeCallbacks: Array<() => void>,
  links: ID3Link[],
  linksMatrix: Array<{}>,
  linkCallbacks: Array<() => void>,
  config: IGraphConfig,
  highlightedNode: string,
  highlightedLink: string,
  transform: number
) {
  return {
    defs: memoizedRenderDefs(config),
    links: renderLinks(
      nodes,
      links,
      linksMatrix,
      config,
      linkCallbacks,
      highlightedNode,
      highlightedLink,
      transform
    ),
    nodes: renderNodes(
      nodes,
      nodeCallbacks,
      config,
      highlightedNode,
      highlightedLink,
      transform,
      linksMatrix
    )
  };
}

export { renderGraph };
