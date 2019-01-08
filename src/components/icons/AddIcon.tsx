import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as React from 'react';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IAddIconProps extends SvgIconProps {}

/**
 * AddIcon: renders icon
 */
class AddIcon extends React.PureComponent<IAddIconProps> {
  public render() {
    return (
      <SvgIcon color="inherit" {...this.props}>
        <path d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5z" />
      </SvgIcon>
    );
  }
}

export default AddIcon;
