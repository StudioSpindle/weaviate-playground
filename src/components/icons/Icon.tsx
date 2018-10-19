import * as React from 'react';
import getColor, { Color } from 'src/utils/getColor';
import styled from 'styled-components';

/**
 * Types
 */
export interface IconProps {
  className?: string;
  color?: Color;
  width?: string;
  height?: string;
  title?: string;
  style?: React.CSSProperties;
}

/**
 * Icon component: wrapper component for icons
 */
export class Icon extends React.Component<IconProps> {
  public render() {
    const { children, className, style, title } = this.props;
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 27 27"
        focusable="false"
        aria-hidden={title ? 'false' : 'true'}
        style={style}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    );
  }
}

/**
 * Style component
 */
export default styled(Icon)`
  display: inline-block;
  color: ${p => (p.color ? getColor(p.color) : 'inherit')};
  fill: currentColor;
  width: ${p => (p.width ? p.width : '1em')};
  height: ${p => (p.height ? p.height : '1em')};
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  flex-shrink: 0;
`;
