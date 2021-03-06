import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as React from 'react';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface ISankeyIconProps extends SvgIconProps {}

/**
 * SankeyIcon: renders icon
 */
class SankeyIcon extends React.PureComponent<ISankeyIconProps> {
  public render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M0,7.45833333 L0,3.5625 C6.6,3.5625 13.4,0 20,0 L20,3.89583333 C13.4,3.89583333 6.6,7.45833333 0,7.45833333 Z M0,12.5416667 C6.6,12.5416667 13.4,16.1041667 20,16.1041667 L20,20 C13.4,20 6.6,16.4375 0,16.4375 L0,12.5416667 Z M0,11.9166667 L0,8.08333333 C6.6,8.08333333 13.4,8.08333333 20,8.08333333 L20,11.9166667 C13.4,11.9166667 6.6,11.9166667 0,11.9166667 Z" />
      </SvgIcon>
    );
  }
}

export default SankeyIcon;
