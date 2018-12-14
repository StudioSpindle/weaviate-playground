import * as React from 'react';
import Icon, { IconProps } from 'src/components/icons/Icon';
import getColor, { Color } from 'src/utils/getColor';

/**
 * Types
 */
export interface IJsonIconProps extends IconProps {
  color?: Color;
  isFilled?: boolean;
}

/**
 * SankeyIcon: renders icon
 */
class JsonIcon extends React.PureComponent<IJsonIconProps> {
  public static defaultProps = {
    color: 'almostBlack',
    isFilled: false
  };

  public render() {
    const { color, isFilled, ...rest } = this.props;
    const fill = getColor(isFilled && color ? color : 'white');
    const stroke = getColor(!isFilled && color ? color : 'white');

    return (
      <Icon {...rest}>
        <g stroke={stroke} strokeWidth="1" fill={fill} fillRule="evenodd">
          <path d="M1.152,0.32 L6.992,2.4 L7.184,2.672 L7.184,5.168 L1.312,7.312 L1.056,7.104 L0.64,5.376 L5.056,3.92 L5.056,3.776 L0.624,2.304 L0.512,2.096 L1.152,0.32 Z M14.736,9.456 L14.928,9.664 L14.784,11.376 L7.632,11.376 L7.44,11.168 L7.584,9.456 L14.736,9.456 Z" />
        </g>
      </Icon>
    );
  }
}

export default JsonIcon;
