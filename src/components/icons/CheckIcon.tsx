import * as React from 'react';
import Icon, { IconProps } from 'src/components/icons/Icon';
import getColor, { Color } from 'src/utils/getColor';

/**
 * Types
 */
export interface ICheckIconProps extends IconProps {
  color?: Color;
}

/**
 * CheckIcon: renders icon
 */
class CheckIcon extends React.PureComponent<ICheckIconProps> {
  public static defaultProps = {
    color: 'almostBlack'
  };

  public render() {
    const { color, ...rest } = this.props;
    const stroke = getColor(color ? color : 'vividPink');

    return (
      <Icon {...rest}>
        <g fill={stroke} fillRule="nonzero">
          <path d="M9.5 15.48l8.82-8.84 1.18 1.18-10 10-4.64-4.64L6.02 12z" />
        </g>
      </Icon>
    );
  }
}

export default CheckIcon;
