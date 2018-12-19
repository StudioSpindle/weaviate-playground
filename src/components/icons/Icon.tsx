import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import * as React from 'react';

/**
 * Types
 */
export interface IconProps {
  className?: string;
  color?: string;
  width?: string;
  height?: string;
  title?: string;
  style?: React.CSSProperties;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'inline-block',
      fill: 'currentColor',
      flexShrink: 0,
      transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      userSelect: 'none'
    }
  });

/**
 * Icon component: wrapper component for icons
 */
export class Icon extends React.Component<IconProps> {
  public render() {
    const {
      children,
      className,
      color,
      height,
      style,
      title,
      width
    } = this.props;
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 27 27"
        focusable="false"
        aria-hidden={title ? 'false' : 'true'}
        style={{
          color: color || 'inherit',
          height: height || '1em',
          width: width || '1em',
          ...style
        }}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    );
  }
}

export default withStyles(styles)(Icon);
