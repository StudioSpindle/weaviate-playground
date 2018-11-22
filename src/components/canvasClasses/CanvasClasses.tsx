import * as d3 from 'd3';
import * as React from 'react';
import { CanvasClass } from 'src/components';
import { ID3Node } from 'src/types';

class CanvasClasses extends React.Component<
  { nodes: ID3Node[]; simulation: any },
  {}
> {
  public componentDidMount() {
    const simulation = this.props.simulation;
    d3.selectAll('.node').call(
      d3
        .drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd)
    );

    function onDragStart(d: any) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function onDrag(d: any) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function onDragEnd(d: any) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }

  public render() {
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    const nodes = this.props.nodes.map((node: ID3Node, index: number) => {
      return (
        <CanvasClass
          classId={node.id}
          key={index}
          node={node}
          // color={color(node.group.toString())}
        />
      );
    });

    return <g className="nodes">{nodes}</g>;
  }
}

export default CanvasClasses;
