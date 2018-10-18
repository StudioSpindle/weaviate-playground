import * as React from 'react';
import Icon, { IconProps } from 'src/components/icons/Icon';
import getColor, { Color } from 'src/utils/getColor';

/**
 * Types
 */
export interface IThingIconProps extends IconProps {
  color?: Color;
  isFilled?: boolean;
}

/**
 * ThingIcon: renders icon
 */
class ThingIcon extends React.PureComponent<IThingIconProps> {
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
          <path d="M1.04166667,6.43733287 L12.5,0 L23.9583333,6.43733287 L12.5,12 L1.04166667,6.43733287 Z M0,20.63939 L0,8 L11.4583333,13.4959911 L11.4583333,27 L0,20.63939 Z M13.5416667,13.4959911 L25,8 L25,20.63939 L13.5416667,27 L13.5416667,13.4959911 Z" />
        </g>
      </Icon>
    );
  }
}

export default ThingIcon;
