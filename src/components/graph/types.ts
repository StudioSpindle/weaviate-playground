import { INodeProps } from '../node/Node';

export type PropertyFunction<T> = (T: IGraphNode) => void;

export interface IGraphD3LinkPart {
  id: string;
}
export interface IGraphD3Link {
  id: string;
  index?: number;
  isActive: boolean;
  isHidden?: boolean;
  source: IGraphD3LinkPart;
  target: IGraphD3LinkPart;
  value?: string;
}
export type IGraphD3Links = IGraphD3Link[];

// tslint:disable-next-line:no-empty-interface
export interface IGraphD3Node extends IGraphNode {}

export type IGraphD3Nodes = IGraphD3Node[];

export interface IGraphLeafConnection {
  [key: string]: IGraphLink;
}

export type IGraphLeafConnections = IGraphLink[];

export interface IGraphLink extends Partial<IGraphLinkConfig> {
  isActive: boolean;
  source: string;
  target: string;
  value?: string;
}

export interface IGraphLinkCallbacks {
  onClickLink(): void;
  onMouseOutLink(): void;
  onMouseOverLink(): void;
}

export interface IGraphLinkConfig {
  color: string;
  highlightColor: string;
  mouseCursor: string;
  opacity: number;
  semanticStrokeWidth: false;
  strokeWidth: number;
  type: string;
}

export type IGraphLinks = IGraphLink[];

export interface IGraphLinksMatrix {
  [key: string]: any;
}

export interface IGraphNode extends Partial<IGraphNodeConfig> {
  id: string;
  fx?: number;
  fy?: number;
  highlighted: boolean;
  x: number;
  y: number;
  _orphan?: boolean;
}

export interface IGraphNodeConfig {
  color: string;
  fontColor: string;
  fontSize: number;
  fontWeight: string;
  highlightColor: string;
  highlightFontSize: number;
  highlightFontWeight: string;
  highlightStrokeColor: string;
  highlightStrokeWidth: number;
  labelProperty: string | PropertyFunction<string>;
  mouseCursor: string;
  opacity: number;
  renderLabel: boolean;
  size: number;
  strokeColor: string;
  strokeWidth: number;
  svg: string;
  symbolType: string;
  viewGenerator(props: INodeProps): HTMLElement;
}

export interface IGraphNodeCallbacks {
  onClickNode(id: string): void;
  onMouseOut(id: string): void;
  onMouseOverNode(id: string): void;
}

export type IGraphNodes = IGraphNode[];

export interface IGraphNodesMatrix {
  [key: string]: IGraphNode;
}

export interface IGraphConfig {
  automaticRearrangeAfterDropNode: boolean;
  collapsible: boolean;
  d3: {
    alphaTarget: number;
    gravity: number;
    linkLength: number;
    linkStrength: number;
  };
  directed: boolean;
  focusAnimationDuration: number;
  focusZoom: number;
  height: number;
  highlightDegree: number;
  highlightOpacity: number;
  link: IGraphLinkConfig;
  linkHighlightBehavior: false;
  maxZoom: number;
  minZoom: number;
  node: IGraphNodeConfig;
  nodeHighlightBehavior: boolean;
  panAndZoom: boolean;
  staticGraph: boolean;
  width: number;
}
