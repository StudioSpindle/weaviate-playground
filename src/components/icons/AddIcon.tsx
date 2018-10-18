import * as React from 'react';
import Icon, { IconProps } from 'src/components/icons/Icon';
import getColor, { Color } from 'src/utils/getColor';

/**
 * Types
 */
export interface IAddIconProps extends IconProps {
  color?: Color;
}

/**
 * AddIcon: renders icon
 */
class AddIcon extends React.PureComponent<IAddIconProps> {
  public static defaultProps = {
    color: 'almostBlack'
  };

  public render() {
    const { color, ...rest } = this.props;
    const stroke = getColor(color ? color : 'vividPink');

    return (
      <Icon {...rest}>
        <g fill={stroke} fill-rule="nonzero">
          <path d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5z" />
        </g>
      </Icon>
    );
  }
}

export default AddIcon;
