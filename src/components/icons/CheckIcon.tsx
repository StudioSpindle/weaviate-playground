import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as React from 'react';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface ICheckIconProps extends SvgIconProps {}

/**
 * CheckIcon: renders icon
 */
class CheckIcon extends React.PureComponent<ICheckIconProps> {
  public render() {
    return (
      <SvgIcon color="inherit" {...this.props}>
        <path d="M9.5 15.48l8.82-8.84 1.18 1.18-10 10-4.64-4.64L6.02 12z" />
      </SvgIcon>
    );
  }
}

export default CheckIcon;
