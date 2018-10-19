import * as React from 'react';
import Icon, { IconProps } from 'src/components/icons/Icon';
import getColor, { Color } from 'src/utils/getColor';

/**
 * Types
 */
export interface ILocalIconProps extends IconProps {
  color?: Color;
  isFilled?: boolean;
}

/**
 * LocalIcon: renders icon
 */
class LocalIcon extends React.PureComponent<ILocalIconProps> {
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
          <path d="M15.9026296,19.772914 L15.9026296,27 L23.1357279,27 L23.1357279,15.5336833 L26.7916349,15.5336833 C26.9578125,14.9822817 26.8338224,15.3933265 27,14.8431781 C15.6140053,1.04590147 27,14.8431781 15.6140053,1.04590147 C14.4631301,-0.348701625 12.536758,-0.348566021 11.3859947,1.04590147 C0,14.8431781 11.3859947,1.04590147 0,14.8431781 C0.166177591,15.3933265 0.0416730183,14.9822817 0.208365091,15.5336833 L3.86375762,15.5336833 L3.86375762,27 L11.0968559,27 L11.0968559,19.772914 L13.5,19.772914 L15.9026296,19.772914 Z" />
        </g>
      </Icon>
    );
  }
}

export default LocalIcon;
