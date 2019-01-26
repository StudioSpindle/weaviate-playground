import React from 'react';

/**
 * Types
 */
export interface IMarker {
  id: string;
  fill: string;
}

/**
 * Component
 */
export default class Marker extends React.Component<IMarker> {
  public render() {
    return (
      <marker
        className="marker"
        id={this.props.id}
        viewBox="0 -5 10 10"
        refX="42" // {this.props.refX}
        refY="0"
        markerWidth="12"
        markerHeight="12"
        orient="auto"
        fill={this.props.fill}
      >
        <path d="M0,-5L10,0L0,5" />
      </marker>
    );
  }
}
