import { Theme, withTheme } from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

/**
 * Types
 */
export interface ILinkProps {
  className: string;
  d: string;
  id: string;
  isActive?: boolean;
  mouseCursor: string;
  opacity: number;
  stroke: string;
  strokeWidth: number;
  source: any;
  target: any;
  theme: Theme;
  value?: string;
  onClickLink(id: string): void;
  onMouseOutLink(source: any, target: any): void;
  onMouseOverLink(source: any, target: any): void;
}

/**
 * Component
 */
class Link extends React.Component<ILinkProps> {
  public handleOnClickLink = () => this.props.onClickLink(this.props.id);

  public handleOnMouseOverLink = () =>
    this.props.onMouseOverLink(this.props.source, this.props.target);

  public handleOnMouseOutLink = () =>
    this.props.onMouseOutLink(this.props.source, this.props.target);

  public render() {
    const {
      className,
      d,
      id,
      isActive,
      mouseCursor,
      opacity,
      stroke,
      strokeWidth,
      theme,
      value
    } = this.props;
    const textValue = value || 'Unkown link';
    const markerWidth = 120;
    const markerHeight = 60;
    const fontSize = '100%';

    const lineStyle = {
      cursor: mouseCursor,
      fill: 'none',
      opacity,
      stroke: isActive ? theme.palette.primary.main : stroke,
      strokeWidth
    };

    const rectStyle = {
      cursor: mouseCursor,
      fill: 'white',
      opacity,
      stroke: isActive ? theme.palette.primary.main : stroke,
      strokeWidth
    };

    const lineProps: any = {
      className,
      d,
      markerEnd: `url(#${id}-marker)`,
      markerMid: `url(#${id})`,
      style: lineStyle
    };

    const bgLineProps: any = {
      d,
      fill: 'none',
      onClick: this.handleOnClickLink,
      onMouseOut: this.handleOnMouseOutLink,
      onMouseOver: this.handleOnMouseOverLink,
      stroke: 'blue',
      strokeOpacity: 0,
      strokeWidth: 50,
      style: { cursor: 'pointer' }
    };

    const rectProps: any = {
      onClick: this.handleOnClickLink,
      onMouseOut: this.handleOnMouseOutLink,
      onMouseOver: this.handleOnMouseOverLink
    };

    return (
      <React.Fragment>
        <defs>
          <marker
            className="marker"
            id={`${id}-marker`}
            viewBox="0 -5 10 10"
            refX="42" // {this.props.refX}
            refY="0"
            markerWidth="12"
            markerHeight="12"
            orient="auto"
            fill={isActive ? theme.palette.primary.main : stroke}
          >
            <path d="M0,-5L10,0L0,5" />
          </marker>
          <marker
            id={id}
            viewBox={`0 0 ${markerHeight} ${markerWidth}`}
            refX={markerWidth / 2}
            refY={markerHeight / 2}
            markerWidth={markerWidth}
            markerHeight={markerHeight}
            {...rectProps}
          >
            <rect
              x={strokeWidth}
              y={strokeWidth}
              width={markerWidth - 2 * strokeWidth}
              height={markerHeight - 2 * strokeWidth}
              rx="10"
              ry="10"
              style={rectStyle}
            />
            <text
              x={(markerWidth - 2 * strokeWidth) / 2}
              y={(markerHeight - 2 * strokeWidth) / 2}
              fill={theme.palette.common.black}
              fontFamily={theme.typography.fontFamily}
              fontSize={fontSize}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {textValue}
            </text>
          </marker>
        </defs>
        <path {...lineProps} />
        <path {...bgLineProps} />
      </React.Fragment>
    );
  }
}

export default compose(withTheme())(Link);
