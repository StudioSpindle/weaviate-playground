import * as React from 'react';
import {
  IGraphNode,
  IGraphNodeCallbacks,
  IGraphNodeConfig
} from '../graph/types';
import CONST from './node.const';
import nodeHelper from './node.helper';

/**
 * Types
 */
export interface INodeProps
  extends Partial<IGraphNode & IGraphNodeConfig & IGraphNodeCallbacks> {
  className: string;
  cursor: string;
  cx: string | number;
  cy: string | number;
  dx: number;
  fill: string;
  id: string;
  label: string;
  opacity: number;
  overrideGlobalViewGenerator?: string | boolean;
  size: number;
  stroke: string;
  type: string;
}

export interface INodePathProps {
  cursor: string;
  d?: string;
  opacity: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onClick(event: React.MouseEvent<SVGElement>): void;
  onMouseOut(
    event: React.MouseEvent<SVGSVGElement | SVGImageElement | SVGPathElement>
  ): void;
  onMouseOver(
    event: React.MouseEvent<SVGSVGElement | SVGImageElement | SVGPathElement>
  ): void;
}

/**
 * Component
 */
export default class Node extends React.Component<INodeProps> {
  public handleOnClickNode = () => {
    const { id, onClickNode } = this.props;

    if (onClickNode) {
      onClickNode(id);
    }
  };

  public handleOnMouseOverNode = () => {
    const { id, onMouseOverNode } = this.props;

    if (onMouseOverNode) {
      onMouseOverNode(id);
    }
  };

  public handleOnMouseOutNode = () => {
    const { id, onMouseOut } = this.props;

    if (onMouseOut) {
      onMouseOut(id);
    }
  };

  public render() {
    const {
      className,
      cursor,
      cx,
      cy,
      dx,
      fill,
      fontColor,
      fontSize,
      fontWeight,
      id,
      label,
      opacity,
      renderLabel,
      size,
      stroke,
      strokeWidth,
      svg,
      type,
      viewGenerator,
      overrideGlobalViewGenerator
    } = this.props;

    const nodeProps: INodePathProps = {
      cursor,
      onClick: this.handleOnClickNode,
      onMouseOut: this.handleOnMouseOutNode,
      onMouseOver: this.handleOnMouseOverNode,
      opacity
    };

    const textProps = {
      dx: dx || CONST.NODE_LABEL_DX,
      dy: CONST.NODE_LABEL_DY,
      fill: fontColor,
      fontSize,
      fontWeight,
      opacity: this.props.opacity
    };

    let gtx = Number(cx);
    let gty = Number(cy);
    let labelComp;
    let node;

    if (svg || viewGenerator) {
      const height = size / 10;
      const width = size / 10;
      const tx = width / 2;
      const ty = height / 2;
      const transform = `translate(${tx},${ty})`;

      labelComp = (
        <text {...textProps} transform={transform}>
          {label}
        </text>
      );

      // By default, if a view generator is set, it takes precedence over any svg image url
      if (viewGenerator && !overrideGlobalViewGenerator) {
        node = (
          <svg {...nodeProps} width={width} height={height}>
            <foreignObject x="0" y="0" width="100%" height="100%">
              <section
                style={{ height, width, backgroundColor: 'transparent' }}
              >
                {viewGenerator(this.props)}
              </section>
            </foreignObject>
          </svg>
        );
      } else {
        node = (
          <image {...nodeProps} href={svg} width={width} height={height} />
        );
      }

      // svg offset transform regarding svg width/height
      gtx -= tx;
      gty -= ty;
    } else {
      nodeProps.d = nodeHelper.buildSvgSymbol(size, type);
      nodeProps.fill = fill;
      nodeProps.stroke = stroke;
      nodeProps.strokeWidth = strokeWidth;

      labelComp = <text {...textProps}>{label}</text>;
      node = <path {...nodeProps} />;
    }

    const gProps = {
      className,
      cx,
      cy,
      id,
      transform: `translate(${gtx},${gty})`
    };

    return (
      <g {...gProps}>
        {node}
        {renderLabel && labelComp}
      </g>
    );
  }
}
