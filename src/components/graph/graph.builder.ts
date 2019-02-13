/**
 * Offers a series of methods that isolate the way graph elements are built (nodes and links mainly).
 */
import { ILinkProps } from '../link/Link';
import { buildLinkPathDefinition } from '../link/link.helper';
import { INodeProps } from '../node/Node';
import CONST from './graph.const';
import {
  IGraphConfig,
  IGraphLink,
  IGraphLinkCallbacks,
  IGraphLinksMatrix,
  IGraphNode,
  IGraphNodeCallbacks,
  IGraphNodesMatrix
} from './types';

/**
 * Get the correct node opacity in order to properly make decisions based on context such as currently highlighted node.
 */
const getNodeOpacity = (
  node: IGraphNode,
  config: IGraphConfig,
  highlightedNode?: string,
  highlightedLink?: IGraphLink
): number => {
  const highlight =
    node.highlighted ||
    node.id === (highlightedLink && highlightedLink.source) ||
    node.id === (highlightedLink && highlightedLink.target);
  const someNodeHighlighted = !!(
    highlightedNode ||
    (highlightedLink && highlightedLink.source && highlightedLink.target)
  );
  let opacity;

  if (someNodeHighlighted && config.highlightDegree === 0) {
    opacity = highlight ? config.node.opacity : config.highlightOpacity;
  } else if (someNodeHighlighted) {
    opacity = highlight ? config.node.opacity : config.highlightOpacity;
  } else {
    opacity = config.node.opacity;
  }

  return opacity;
};

/**
 * Build some Link properties based on given parameters.
 */
const buildLinkProps = (
  link: IGraphLink,
  nodes: IGraphNodesMatrix,
  links: IGraphLinksMatrix,
  config: IGraphConfig,
  linkCallbacks: IGraphLinkCallbacks,
  transform: number,
  highlightedNode?: string,
  highlightedLink?: IGraphLink
): Partial<ILinkProps> => {
  const { isActive, source, target, value } = link;
  const x1 = (nodes[source] && nodes[source].x) || 0;
  const y1 = (nodes[source] && nodes[source].y) || 0;
  const x2 = (nodes[target] && nodes[target].x) || 0;
  const y2 = (nodes[target] && nodes[target].y) || 0;
  const d = buildLinkPathDefinition({
    source: {
      x: x1,
      y: y1
    },
    target: {
      x: x2,
      y: y2
    }
  });

  let mainNodeParticipates = false;

  switch (config.highlightDegree) {
    case 0:
      break;
    case 2:
      mainNodeParticipates = true;
      break;
    default:
      // 1st degree is the fallback behavior
      mainNodeParticipates =
        source === highlightedNode || target === highlightedNode;
      break;
  }

  const reasonNode =
    mainNodeParticipates &&
    nodes[source].highlighted &&
    nodes[target].highlighted;
  const reasonLink =
    source === (highlightedLink && highlightedLink.source) &&
    target === (highlightedLink && highlightedLink.target);
  const highlight = reasonNode || reasonLink;

  let opacity = config.link.opacity;

  if (highlightedNode || (highlightedLink && highlightedLink.source)) {
    opacity = highlight ? config.link.opacity : config.highlightOpacity;
  }

  let stroke = link.color || config.link.color;

  if (highlight) {
    stroke =
      config.link.highlightColor === CONST.KEYWORDS.SAME
        ? config.link.color
        : config.link.highlightColor;
  }

  let strokeWidth = config.link.strokeWidth * (1 / transform);

  if (config.link.semanticStrokeWidth) {
    const linkValue = links[source][target] || links[target][source] || 1;

    strokeWidth += (linkValue * strokeWidth) / 10;
  }

  return {
    className: CONST.LINK_CLASS_NAME,
    d,
    isActive,
    mouseCursor: config.link.mouseCursor,
    onClickLink: linkCallbacks.onClickLink,
    onMouseOutLink: linkCallbacks.onMouseOutLink,
    onMouseOverLink: linkCallbacks.onMouseOverLink,
    opacity,
    source,
    stroke,
    strokeWidth,
    target,
    value
  };
};

/**
 * Build some Node properties based on given parameters.
 */
const buildNodeProps = (
  node: IGraphNode,
  config: IGraphConfig,
  nodeCallbacks: IGraphNodeCallbacks,
  transform: number,
  highlightedNode?: string,
  highlightedLink?: IGraphLink
): INodeProps => {
  const highlight =
    node.highlighted ||
    (node.id === (highlightedLink && highlightedLink.source) ||
      node.id === (highlightedLink && highlightedLink.target));
  const opacity = getNodeOpacity(
    node,
    config,
    highlightedNode,
    highlightedLink
  );
  let fill = node.color || config.node.color;

  if (highlight && config.node.highlightColor !== CONST.KEYWORDS.SAME) {
    fill = config.node.highlightColor;
  }

  let stroke = node.strokeColor || config.node.strokeColor;

  if (highlight && config.node.highlightStrokeColor !== CONST.KEYWORDS.SAME) {
    stroke = config.node.highlightStrokeColor;
  }

  let label = node[config.node.labelProperty as string] || node.id;

  if (typeof config.node.labelProperty === 'function') {
    label = config.node.labelProperty(node);
  }

  const t = 1 / transform;
  const nodeSize = node.size || config.node.size;
  const fontSize = highlight
    ? config.node.highlightFontSize
    : config.node.fontSize;
  const dx = fontSize * t + nodeSize / 100 + 1.5;
  const strokeWidth = highlight
    ? config.node.highlightStrokeWidth
    : config.node.strokeWidth;
  const svg = node.svg || config.node.svg;
  const fontColor = node.fontColor || config.node.fontColor;

  return {
    ...node,
    className: CONST.NODE_CLASS_NAME,
    cursor: config.node.mouseCursor,
    cx: (node && node.x) || '0',
    cy: (node && node.y) || '0',
    dx,
    fill,
    fontColor,
    fontSize: fontSize * t,
    fontWeight: highlight
      ? config.node.highlightFontWeight
      : config.node.fontWeight,
    id: node.id,
    label,
    onClickNode: nodeCallbacks.onClickNode,
    onMouseOut: nodeCallbacks.onMouseOut,
    onMouseOverNode: nodeCallbacks.onMouseOverNode,
    opacity,
    overrideGlobalViewGenerator: !node.viewGenerator && node.svg,
    renderLabel: config.node.renderLabel,
    size: nodeSize * t,
    stroke,
    strokeWidth: strokeWidth * t,
    svg,
    type: node.symbolType || config.node.symbolType,
    viewGenerator: node.viewGenerator || config.node.viewGenerator
  };
};

export { buildLinkProps, buildNodeProps };
