import { drag as d3Drag } from 'd3-drag';
import { forceLink as d3ForceLink, SimulationLinkDatum } from 'd3-force';
import {
  event as d3Event,
  select as d3Select,
  selectAll as d3SelectAll
} from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';
import * as React from 'react';
import { ID3Link, ID3Node } from '../canvas/Canvas';
import ERRORS from '../err';
import utils from '../utils';
import * as collapseHelper from './collapse.helper';
import DEFAULT_CONFIG from './graph.config';
import CONST from './graph.const';
import * as graphHelper from './graph.helper';
import * as graphRenderer from './graph.renderer';

/**
 * Types
 */

export interface IGraphConfig {
  automaticRearrangeAfterDropNode: boolean;
  collapsible: boolean;
  d3: {
    alphaTarget: string;
    linkLength: number;
    linkStrength: number;
  };
  directed: boolean;
  focusAnimationDuration: number;
  height: number;
  linkHighlightBehavior: boolean;
  maxZoom: number;
  minZoom: number;
  nodeHighlightBehavior: boolean;
  panAndZoom: boolean;
  staticGraph: boolean;
  width: number;
}

export interface IGraphProps {
  config: {};
  data: {
    focusedNodeId: string;
    links: ID3Link[];
    nodes: ID3Node[];
  };
  id: string;
  onClickGraph?(): void;
  onClickLink?(source: string, target: string): void;
  onClickNode?(id: string): void;
  onMouseOverLink?(source: string, target: string): void;
  onMouseOverNode?(id: string): void;
  onMouseOutLink?(source: string, target: string): void;
  onMouseOutNode?(id: string): void;
}

export interface IGraphState {
  config: IGraphConfig;
  configUpdated: boolean;
  d3ConfigUpdated: boolean;
  d3Links: Array<SimulationLinkDatum<{}>>;
  d3Nodes: {};
  enableFocusAnimation: boolean;
  focusedNodeId: string;
  focusTransformation: boolean;
  highlightedLink?: { source: string; target: string };
  highlightedNode?: string;
  id: string;
  links: Array<{}>;
  newGraphElements: boolean;
  nodes: Array<{
    fx: number;
    fy: number;
    x: number;
    y: number;
  }>;
  simulation: {
    force: any;
    nodes(nodes: any): void;
  };
  transform: string;
}

/**
 * Component
 */
export default class Graph extends React.Component<IGraphProps, IGraphState> {
  public focusAnimationTimeout: any;
  constructor(props: IGraphProps) {
    super(props);

    if (!this.props.id) {
      utils.throwErr(this.constructor.name, ERRORS.GRAPH_NO_ID_PROP);
    }

    this.focusAnimationTimeout = null;
    // @ts-ignore
    this.state = graphHelper.initializeGraphState(this.props, this.state);
  }

  /**
   * @deprecated
   * `componentWillReceiveProps` has a replacement method in react v16.3 onwards.
   * that is getDerivedStateFromProps.
   * But one needs to be aware that if an anti pattern of `componentWillReceiveProps` is
   * in place for this implementation the migration might not be that easy.
   * See {@link https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html}.
   * @param {Object} nextProps - props.
   * @returns {undefined}
   */
  public componentWillReceiveProps(nextProps: IGraphProps) {
    const {
      graphElementsUpdated,
      newGraphElements
    } = graphHelper.checkForGraphElementsChanges(nextProps, this.state);
    const state = graphElementsUpdated
      ? // @ts-ignore
        graphHelper.initializeGraphState(nextProps, this.state)
      : this.state;
    // @ts-ignore
    const newConfig: IGraphConfig = nextProps.config || {};
    const {
      configUpdated,
      d3ConfigUpdated
    } = graphHelper.checkForGraphConfigChanges(nextProps, this.state);
    const config = configUpdated
      ? utils.merge(DEFAULT_CONFIG, newConfig)
      : this.state.config;

    // in order to properly update graph data we need to pause eventual d3 ongoing animations
    if (newGraphElements) {
      this.pauseSimulation();
    }

    const transform =
      newConfig.panAndZoom !== this.state.config.panAndZoom
        ? 1
        : this.state.transform;

    const focusedNodeId = nextProps.data.focusedNodeId;
    // @ts-ignore
    const d3FocusedNode = this.state.d3Nodes.find(
      // @ts-ignore
      node => `${node.id}` === `${focusedNodeId}`
    );
    const focusTransformation = graphHelper.getCenterAndZoomTransformation(
      d3FocusedNode,
      this.state.config
    );
    const enableFocusAnimation =
      this.props.data.focusedNodeId !== nextProps.data.focusedNodeId;

    this.setState({
      ...state,
      config,
      configUpdated,
      d3ConfigUpdated,
      enableFocusAnimation,
      focusTransformation,
      focusedNodeId,
      newGraphElements,
      transform
    });
  }

  public componentDidUpdate() {
    // if the property staticGraph was activated we want to stop possible ongoing simulation
    if (this.state.config.staticGraph) {
      this.pauseSimulation();
    }

    if (
      !this.state.config.staticGraph &&
      (this.state.newGraphElements || this.state.d3ConfigUpdated)
    ) {
      this.graphForcesConfig();
      this.restartSimulation();
      this.setState({ newGraphElements: false, d3ConfigUpdated: false });
    }

    if (this.state.configUpdated) {
      this.zoomConfig();
      this.setState({ configUpdated: false });
    }
  }

  public componentDidMount() {
    if (!this.state.config.staticGraph) {
      this.graphForcesConfig();
    }

    // graph zoom and drag&drop all network
    this.zoomConfig();
  }

  public componentWillUnmount() {
    this.pauseSimulation();
  }

  /**
   * Obtain a set of properties which will be used to perform the focus and zoom animation if
   * required. In case there's not a focus and zoom animation in progress, it should reset the
   * transition duration to zero and clear transformation styles.
   */
  public generateFocusAnimationProps = (): {} => {
    const { enableFocusAnimation, focusedNodeId } = this.state;

    // In case an older animation was still not complete, clear previous timeout to ensure the new one is not cancelled
    if (enableFocusAnimation) {
      if (this.focusAnimationTimeout) {
        clearTimeout(this.focusAnimationTimeout);
      }

      this.focusAnimationTimeout = setTimeout(
        () => this.setState({ enableFocusAnimation: false }),
        this.state.config.focusAnimationDuration * 1000
      );
    }

    const transitionDuration = this.state.enableFocusAnimation
      ? this.state.config.focusAnimationDuration
      : 0;

    return {
      style: { transitionDuration: `${transitionDuration}s` },
      transform: focusedNodeId ? this.state.focusTransformation : null
    };
  };

  /**
   * Sets d3 tick function and configures other d3 stuff such as forces and drag events.
   */
  public graphForcesConfig(): void {
    // @ts-ignore
    this.state.simulation.nodes(this.state.d3Nodes).on('tick', this.tick);

    const forceLink = d3ForceLink(this.state.d3Links)
      // @ts-ignore
      .id(link => link.id)
      .distance(this.state.config.d3.linkLength)
      .strength(this.state.config.d3.linkStrength);

    this.state.simulation.force(CONST.LINK_CLASS_NAME, forceLink);

    const customNodeDrag = d3Drag()
      .on('start', this.onDragStart)
      // @ts-ignore
      .on('drag', this.onDragMove)
      .on('end', this.onDragEnd);

    d3Select(`#${this.state.id}-${CONST.GRAPH_WRAPPER_ID}`)
      .selectAll('.node')
      .call(customNodeDrag);
  }

  public onDragEnd = () =>
    !this.state.config.staticGraph &&
    this.state.config.automaticRearrangeAfterDropNode &&
    this.state.simulation
      // @ts-ignore
      .alphaTarget(this.state.config.d3.alphaTarget)
      .restart();

  public onDragMove = (ev: {}, index: number, nodeList: [{ id: string }]) => {
    const id = nodeList[index].id;

    if (!this.state.config.staticGraph) {
      // this is where d3 and react bind
      const draggedNode = this.state.nodes[id];

      draggedNode.x += d3Event.dx;
      draggedNode.y += d3Event.dy;

      // set nodes fixing coords fx and fy
      draggedNode.fx = draggedNode.x;
      draggedNode.fy = draggedNode.y;

      this.tick();
    }
  };

  public onDragStart = () => {
    this.pauseSimulation();
    if (this.state.enableFocusAnimation) {
      this.setState({ enableFocusAnimation: false });
    }
  };

  public setNodeHighlightedValue = (id: string, value = false) =>
    this.tick(
      graphHelper.updateNodeHighlightedValue(
        this.state.nodes,
        this.state.links,
        this.state.config,
        id,
        // @ts-ignore
        value
      )
    );

  /**
   * The tick function simply calls React set state in order to update component and render nodes
   * along time as d3 calculates new node positioning.
   */
  public tick = (state?: {}, cb?: () => void) => {
    if (!state) {
      state = {};
    }
    return cb ? this.setState(state, cb) : this.setState(state);
  };

  /**
   * Configures zoom upon graph with default or user provided values.
   */
  public zoomConfig = () =>
    d3Select(`#${this.state.id}-${CONST.GRAPH_WRAPPER_ID}`).call(
      d3Zoom()
        .scaleExtent([this.state.config.minZoom, this.state.config.maxZoom])
        .on('zoom', this.zoomed)
    );

  /**
   * Handler for 'zoom' event within zoom config. Returns the transformed elements within the svg graph area.
   */
  public zoomed = () => {
    const transform = d3Event.transform;

    d3SelectAll(`#${this.state.id}-${CONST.GRAPH_CONTAINER_ID}`).attr(
      'transform',
      transform
    );

    if (this.state.config.panAndZoom) {
      this.setState({ transform: transform.k });
    }
  };

  public onClickGraph = (event: React.MouseEvent<SVGSVGElement>) => {
    if (this.state.enableFocusAnimation) {
      this.setState({ enableFocusAnimation: false });
    }

    // Only trigger the graph onClickHandler, if not clicked a node or link.
    // toUpperCase() is added as a precaution, as the documentation says tagName should always
    // return in UPPERCASE, but chrome returns lowercase
    if (
      // @ts-ignore
      event.target.tagName.toUpperCase() === 'SVG' &&
      // @ts-ignore
      event.target.attributes.name.value === `svg-container-${this.state.id}` &&
      this.props.onClickGraph
    ) {
      this.props.onClickGraph();
    }
  };

  /**
   * Collapses the nodes, then calls the callback passed to the component.
   */
  public onClickNode = (clickedNodeId: string): void => {
    const { onClickNode } = this.props;
    const { config } = this.state;

    if (config.collapsible) {
      const leafConnections = collapseHelper.getTargetLeafConnections(
        clickedNodeId,
        this.state.links,
        config
      );

      const links = collapseHelper.toggleLinksMatrixConnections(
        this.state.links,
        leafConnections,
        config
      );

      const d3Links = collapseHelper.toggleLinksConnections(
        this.state.d3Links,
        // @ts-ignore
        links
      );

      this.tick(
        {
          d3Links,
          links
        },
        () => onClickNode && onClickNode(clickedNodeId)
      );
    } else if (onClickNode) {
      onClickNode(clickedNodeId);
    }
  };

  public onMouseOverNode = (id: string) => {
    const { onMouseOverNode } = this.props;
    const { config } = this.state;

    if (onMouseOverNode) {
      onMouseOverNode(id);
    }

    if (config.nodeHighlightBehavior) {
      this.setNodeHighlightedValue(id, true);
    }
  };

  public onMouseOutNode = (id: string) => {
    const { onMouseOutNode } = this.props;
    const { config } = this.state;

    if (onMouseOutNode) {
      onMouseOutNode(id);
    }

    if (config.nodeHighlightBehavior) {
      this.setNodeHighlightedValue(id, false);
    }
  };

  public onMouseOverLink = (source: string, target: string) => {
    const { onMouseOverLink } = this.props;
    const { config } = this.state;

    if (onMouseOverLink) {
      onMouseOverLink(source, target);
    }

    if (config.linkHighlightBehavior) {
      // @ts-ignore
      this.state.highlightedLink = { source, target };

      this.tick();
    }
  };

  public onMouseOutLink = (source: string, target: string) => {
    const { onMouseOutLink } = this.props;
    const { config } = this.state;

    if (onMouseOutLink) {
      onMouseOutLink(source, target);
    }

    if (config.linkHighlightBehavior) {
      // @ts-ignore
      this.state.highlightedLink = undefined;

      this.tick();
    }
  };
  // @ts-ignore
  public pauseSimulation = () => this.state.simulation.stop();

  /**
   * This method resets all nodes fixed positions by deleting the properties fx (fixed x)
   * and fy (fixed y). Following this, a simulation is triggered in order to force nodes to go back
   * to their original positions (or at least new positions according to the d3 force parameters).
   */
  public resetNodesPositions = () => {
    if (!this.state.config.staticGraph) {
      for (const nodeId of Object.keys(this.state.nodes)) {
        const node = this.state.nodes[nodeId];

        if (node.fx && node.fy) {
          Reflect.deleteProperty(node, 'fx');
          Reflect.deleteProperty(node, 'fy');
        }
      }

      this.state.simulation
        // @ts-ignore
        .alphaTarget(this.state.config.d3.alphaTarget)
        .restart();

      this.tick();
    }
  };

  public restartSimulation = () =>
    // @ts-ignore
    !this.state.config.staticGraph && this.state.simulation.restart();

  public render() {
    const { onClickLink } = this.props;
    const {
      config,
      d3Links,
      highlightedLink,
      highlightedNode,
      id,
      transform
    } = this.state;

    const { nodes, links, defs } = graphRenderer.renderGraph(
      // @ts-ignore
      this.state.nodes,
      {
        // @ts-ignore
        onClickNode: this.onClickNode,
        onMouseOut: this.onMouseOutNode,
        onMouseOverNode: this.onMouseOverNode
      },
      d3Links,
      this.state.links,
      {
        onClickLink,
        onMouseOutLink: this.onMouseOutLink,
        onMouseOverLink: this.onMouseOverLink
      },
      config,
      highlightedNode,
      highlightedLink,
      transform
    );

    const svgStyle = {
      height: config.height,
      width: config.width
    };

    const containerProps = this.generateFocusAnimationProps();

    return (
      <div id={`${id}-${CONST.GRAPH_WRAPPER_ID}`}>
        <svg
          name={`svg-container-${id}`}
          style={svgStyle}
          onClick={this.onClickGraph}
        >
          {defs}
          <g id={`${id}-${CONST.GRAPH_CONTAINER_ID}`} {...containerProps}>
            {links}
            {nodes}
          </g>
        </svg>
      </div>
    );
  }
}
