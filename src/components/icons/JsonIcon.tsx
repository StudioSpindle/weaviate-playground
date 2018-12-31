import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as React from 'react';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IJsonIconProps extends SvgIconProps {}

/**
 * SankeyIcon: renders icon
 */
class JsonIcon extends React.PureComponent<IJsonIconProps> {
  public render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M1.152,0.32 L6.992,2.4 L7.184,2.672 L7.184,5.168 L1.312,7.312 L1.056,7.104 L0.64,5.376 L5.056,3.92 L5.056,3.776 L0.624,2.304 L0.512,2.096 L1.152,0.32 Z M14.736,9.456 L14.928,9.664 L14.784,11.376 L7.632,11.376 L7.44,11.168 L7.584,9.456 L14.736,9.456 Z" />
      </SvgIcon>
    );
  }
}

export default JsonIcon;
