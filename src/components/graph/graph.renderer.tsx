import * as React from 'react';
import Link from '../link/Link';
import Marker from '../marker/Marker';
import { MARKERS } from '../marker/marker.const';
import Node from '../node/Node';
import { isNodeVisible } from './collapse.helper';
import { buildLinkProps, buildNodeProps } from './graph.builder';
import CONST from './graph.const';
import {
  IGraphConfig,
  IGraphD3Link,
  IGraphD3Links,
  IGraphLink,
  IGraphLinkCallbacks,
  IGraphNodeCallbacks,
  IGraphNodes
} from './types';

const renderLinks = (
  nodes: IGraphNodes,
  links: IGraphD3Links,
  linksMatrix: Array<{}>,
  config: IGraphConfig,
  linkCallbacks: IGraphLinkCallbacks,
  transform: number,
  highlightedNode?: string,
  highlightedLink?: IGraphLink
) => {
  let outLinks = links;

  if (config.collapsible) {
    outLinks = outLinks.filter(({ isHidden }) => !isHidden);
  }

  return outLinks.map(link => {
    const { source, target } = link;
    const sourceId = typeof source === 'string' ? source : source.id; // source.id;
    const targetId = typeof source === 'string' ? target : target.id; // target.id;
    const key = `${sourceId}${CONST.COORDS_SEPARATOR}${targetId}`;
    const props = buildLinkProps(
      {
        ...link,
        source: `${sourceId}`,
        target: `${targetId}`
      } as IGraphLink,
      nodes,
      linksMatrix,
      config,
      linkCallbacks,
      transform,
      highlightedNode,
      highlightedLink
    );

    return <Link key={key} {...props} />;
  });
};

const renderNodes = (
  nodes: IGraphNodes,
  nodeCallbacks: IGraphNodeCallbacks,
  config: IGraphConfig,
  transform: number,
  linksMatrix: Array<{}>,
  highlightedNode?: string,
  highlightedLink?: IGraphLink
) => {
  let outNodes = Object.keys(nodes);

  if (config.collapsible) {
    outNodes = outNodes.filter(nodeId =>
      isNodeVisible(nodeId, nodes, linksMatrix)
    );
  }

  return outNodes.map(nodeId => {
    const props = buildNodeProps(
      Object.assign({}, nodes[nodeId], { id: `${nodeId}` }),
      config,
      nodeCallbacks,
      transform,
      highlightedNode,
      highlightedLink
    );

    return <Node key={nodeId} {...props} />;
  });
};

/**
 * Builds graph defs (for now markers, but we could also have gradients for instance).
 * NOTE: defs are static svg graphical objects, thus we only need to render them once, the result
 * is cached on the 1st call and from there we simply return the cached jsx.
 */
const renderDefs = () => {
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
};

/**
 * Memoized reference for _renderDefs.
 */
const memoizedRenderDefs = renderDefs();

/**
 * Method that actually is exported an consumed by Graph component in order to build all Nodes and Link
 * components.
 */
function renderGraph(
  nodes: IGraphNodes,
  nodeCallbacks: IGraphNodeCallbacks,
  links: IGraphD3Link[],
  linksMatrix: Array<{}>,
  linkCallbacks: IGraphLinkCallbacks,
  config: IGraphConfig,
  transform: number,
  highlightedNode?: string,
  highlightedLink?: IGraphLink
) {
  return {
    defs: memoizedRenderDefs(config),
    links: renderLinks(
      nodes,
      links,
      linksMatrix,
      config,
      linkCallbacks,
      transform,
      highlightedNode,
      highlightedLink
    ),
    nodes: renderNodes(
      nodes,
      nodeCallbacks,
      config,
      transform,
      linksMatrix,
      highlightedNode,
      highlightedLink
    )
  };
}

export { renderGraph };
