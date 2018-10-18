import * as React from 'react';
import Icon, { IconProps } from 'src/components/icons/Icon';
import getColor, { Color } from 'src/utils/getColor';

/**
 * Types
 */
export interface INetworkIconProps extends IconProps {
  color?: Color;
  isFilled?: boolean;
}

/**
 * NetworkIcon: renders icon
 */
class NetworkIcon extends React.PureComponent<INetworkIconProps> {
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
          <path d="M11.114375,1.36517857 C8.33803571,1.89955357 6.02821429,3.23660714 4.12017857,5.34598214 C5.29696429,5.89375 6.49116071,6.28883929 7.74160714,6.58660714 C8.31482143,4.478125 9.45232143,2.75491071 11.114375,1.36517857 Z M15.8224107,1.34017857 C15.81125,1.35580357 15.8005357,1.37053571 15.7898214,1.38571429 C15.8670536,1.453125 15.9478571,1.51696429 16.0210714,1.58839286 C16.3670536,1.92455357 16.7313393,2.24508929 17.051875,2.60401786 C18.03625,3.70803571 18.72375,4.97946429 19.12375,6.40401786 C19.164375,6.54821429 19.2148214,6.59464286 19.3710714,6.54419643 C20.1688393,6.28616071 20.9733036,6.04955357 21.7683929,5.784375 C22.1157143,5.66919643 22.4469643,5.50401786 22.808125,5.35223214 C20.8907143,3.23705357 18.5804464,1.89508929 15.8224107,1.34017857 Z M8.78,6.81875 C10.1710714,7.09955357 11.5416071,7.246875 12.9277679,7.27901786 L12.9277679,1.68303571 C12.3500893,1.80491071 11.8616964,2.07008929 11.4313393,2.43883929 C10.0777679,3.59910714 9.38267857,5.15803571 8.78,6.81875 Z M18.1692857,6.86696429 C17.9023214,6.23392857 17.6710714,5.62767857 17.3942857,5.04196429 C16.9425,4.08616071 16.37375,3.20625 15.5666071,2.50357143 C15.1130357,2.10848214 14.6072321,1.80848214 14.0009821,1.6875 L14.0009821,7.32946429 C15.3933929,7.30044643 16.7527679,7.14776786 18.1692857,6.86696429 Z M19.4701786,19.5754464 C19.4451786,19.6522321 19.4291071,19.7053571 19.41125,19.7575893 C19.17375,20.453125 18.9679464,21.1607143 18.6920536,21.8397321 C18.2099107,23.0285714 17.5804464,24.1348214 16.6523214,25.0428571 C16.3991964,25.2897321 16.1210714,25.5107143 15.8103571,25.7825893 C18.9563393,25.1223214 21.4599107,23.5486607 23.4090179,21.0348214 C22.1353571,20.3790179 20.8438393,19.8933036 19.4701786,19.5754464 Z M3.51839286,21.0575893 C5.46526786,23.5589286 7.96705357,25.1388393 11.0724107,25.7602679 C10.08,25.0178571 9.37196429,24.046875 8.79026786,22.975 C8.208125,21.9022321 7.79339286,20.7602679 7.46482143,19.5933036 C6.73892857,19.6571429 4.23625,20.5861607 3.51839286,21.0575893 Z M13.9965179,18.80625 L13.9965179,25.4758929 C14.2411607,25.3839286 14.4688393,25.3151786 14.6813393,25.2147321 C15.3942857,24.8763393 15.9433929,24.3397321 16.414375,23.7205357 C17.395625,22.4303571 17.9835714,20.9544643 18.4121429,19.4066964 C18.4188393,19.3821429 18.4152679,19.3553571 18.4166071,19.3241071 C16.9603571,19.0120536 15.4974107,18.8459821 13.9965179,18.80625 Z M8.50142857,19.3410714 C8.50321429,19.3611607 8.50232143,19.3816964 8.50767857,19.4013393 C8.89607143,20.8133929 9.42598214,22.1647321 10.2585714,23.3799107 C10.7625893,24.1160714 11.3563393,24.765625 12.1652679,25.1772321 C12.4027679,25.2977679 12.6625893,25.3754464 12.9259821,25.478125 L12.9259821,18.8205357 C12.1103571,18.7602679 9.23491071,19.1004464 8.50142857,19.3410714 Z M8.50544643,7.92991071 C8.10366071,9.403125 7.85276786,10.9419643 7.78803571,12.5125 L12.9603571,12.5125 L12.9603571,8.43526786 C11.4724107,8.26651786 10.0063393,8.10044643 8.50544643,7.92991071 Z M13.9929464,12.5165179 L19.1675,12.5165179 C19.1072321,10.9183036 18.8755357,9.36294643 18.4773214,7.88035714 C16.970625,8.065625 15.4889286,8.24776786 13.9929464,8.43169643 L13.9929464,12.5165179 Z M13.9925,17.7803571 C15.5728571,17.8026786 17.1246429,18.0258929 18.6715179,18.3178571 C19.0054464,16.7339286 19.176875,15.1741071 19.1661607,13.5825893 L13.9925,13.5825893 L13.9925,17.7803571 Z M7.77017857,13.5799107 C7.77776786,15.1821429 7.92821429,16.7544643 8.27330357,18.3084821 C8.35142857,18.3008929 8.40053571,18.3 8.44830357,18.290625 C9.87330357,18.0138393 11.3076786,17.8169643 12.7608036,17.7901786 C12.9326786,17.7870536 12.9679464,17.721875 12.9670536,17.5651786 C12.9616964,16.3111607 12.964375,15.0571429 12.9634821,13.8026786 C12.9634821,13.7290179 12.9563393,13.6553571 12.9523214,13.5799107 L7.77017857,13.5799107 Z M7.45321429,7.57410714 C6.05008929,7.25178571 4.72464286,6.78035714 3.44339286,6.18839286 C2.04294643,8.08392857 1.25410714,10.1808036 1.055,12.5165179 L6.745625,12.5165179 C6.80678571,10.8473214 7.03714286,9.21607143 7.45321429,7.57410714 Z M25.9188393,12.5174107 C25.7175,10.1736607 24.9264286,8.07276786 23.5282143,6.18705357 C22.2215179,6.79196429 20.8777679,7.25401786 19.4692857,7.57455357 C19.8849107,9.215625 20.1125893,10.853125 20.1777679,12.5174107 L25.9188393,12.5174107 Z M19.6875893,18.5732143 C21.2125893,18.9267857 22.63,19.4709821 23.9884821,20.1892857 C25.2701786,18.1633929 25.9085714,15.9700893 25.9183929,13.5790179 L20.21125,13.5790179 C20.2023214,15.2589286 20.039375,16.9129464 19.6875893,18.5732143 Z M7.201875,18.5808036 C7.07821429,17.7276786 6.93267857,16.9075893 6.84651786,16.08125 C6.76080357,15.2549107 6.73446429,14.4227679 6.68133929,13.58125 L1.00008929,13.58125 C1.01348214,15.9745536 1.64517857,18.1696429 2.92330357,20.1897321 C4.29428571,19.4647321 5.71392857,18.9241071 7.201875,18.5808036 Z" />
        </g>
      </Icon>
    );
  }
}

export default NetworkIcon;
