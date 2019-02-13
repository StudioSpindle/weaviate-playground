import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as React from 'react';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IThingIconProps extends SvgIconProps {}

/**
 * ThingIcon: renders icon
 */
class ThingIcon extends React.PureComponent<IThingIconProps> {
  public render() {
    return (
      <SvgIcon color="inherit" {...this.props}>
        <path d="M1.04166667,6.43733287 L12.5,0 L23.9583333,6.43733287 L12.5,12 L1.04166667,6.43733287 Z M0,20.63939 L0,8 L11.4583333,13.4959911 L11.4583333,27 L0,20.63939 Z M13.5416667,13.4959911 L25,8 L25,20.63939 L13.5416667,27 L13.5416667,13.4959911 Z" />
      </SvgIcon>
    );
  }
}

export default ThingIcon;
