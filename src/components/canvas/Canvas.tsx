import * as d3 from 'd3';
import * as React from 'react';
import { CanvasClasses, CanvasLinks } from 'src/components';
import { ID3Graph, ID3Node } from 'src/types';

interface ICanvasProps {
  width: number;
  height: number;
  graph: ID3Graph;
}

class Canvas extends React.Component<ICanvasProps, {}> {
  public simulation: any;

  constructor(props: ICanvasProps) {
    super(props);
    this.simulation = null;
    this.simulate();
  }

  public componentDidMount() {
    this.addAttrs();
  }

  public componentDidUpdate(prevProps: ICanvasProps) {
    const { graph } = this.props;
    if (
      graph.nodes !== prevProps.graph.nodes ||
      graph.links !== prevProps.graph.links
    ) {
      // d3.selectAll('svg.container').remove();
      this.simulate();
      this.addAttrs();
      this.simulation.alpha(0.8).restart();
    }
  }

  public simulate() {
    const { graph, height, width } = this.props;
    this.simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink().id((d: ID3Node) => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .nodes(graph.nodes);

    this.simulation.force('link').links(graph.links);
  }

  public addAttrs() {
    const node = d3.selectAll('.node');
    const link = d3.selectAll('.link');

    this.simulation.nodes(this.props.graph.nodes).on('tick', ticked);

    function ticked() {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    }
  }

  public render() {
    const { graph } = this.props;
    return (
      <svg className="container" width="100%" height="100%">
        <CanvasLinks links={graph.links} />
        <CanvasClasses nodes={graph.nodes} simulation={this.simulation} />
      </svg>
    );
  }
}

export default Canvas;
