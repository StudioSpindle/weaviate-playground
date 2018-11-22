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

  public componentDidUpdate() {
    this.simulate();
    this.addAttrs();
  }

  public simulate() {
    this.simulation = d3
      .forceSimulation()
      .force(
        'link',
        // tslint:disable-next-line:only-arrow-functions
        d3.forceLink().id(function(d: ID3Node) {
          return d.id;
        })
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force(
        'center',
        d3.forceCenter(this.props.width / 2, this.props.height / 2)
      )
      .nodes(this.props.graph.nodes);

    this.simulation.force('link').links(this.props.graph.links);
  }

  public addAttrs() {
    const node = d3.selectAll('.node');
    const link = d3.selectAll('.link');

    this.simulation.nodes(this.props.graph.nodes).on('tick', ticked);

    function ticked() {
      link
        // tslint:disable-next-line:only-arrow-functions
        .attr('x1', function(d: any) {
          return d.source.x;
        })
        // tslint:disable-next-line:only-arrow-functions
        .attr('y1', function(d: any) {
          return d.source.y;
        })
        // tslint:disable-next-line:only-arrow-functions
        .attr('x2', function(d: any) {
          return d.target.x;
        })
        // tslint:disable-next-line:only-arrow-functions
        .attr('y2', function(d: any) {
          return d.target.y;
        });

      node
        // tslint:disable-next-line:only-arrow-functions
        .attr('transform', function(d: any) {
          return `translate(${d.x}, ${d.y})`;
        });
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
