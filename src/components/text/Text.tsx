import * as React from 'react';
import getColor, { Color } from 'src/utils/getColor';
import getTextSize from 'src/utils/getTextSize';
import styled from 'styled-components';

/**
 * Types
 */
type DefaultProps = Readonly<typeof defaultProps>;
export type FontStyle = 'normal' | 'italic';
export type FontWeight = 'regular' | 'bold' | 'light';
export type TextTransform = 'capitalize' | 'lowercase' | 'uppercase' | 'none';
export type TextWrap = 'normal' | 'noWrap' | 'breakWord' | 'ellipsis';
export type TextComponent =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span';

export interface IText {
  className?: string;
  color?: Color;
  colorVariant?: string;
  component?: TextComponent;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
  gutter?: boolean;
  textTransform?: TextTransform;
  textWrap?: TextWrap;
  size?: string;
}

const defaultProps: IText = {
  color: 'almostBlack',
  component: 'span',
  fontWeight: 'regular',
  gutter: false,
  textWrap: 'normal'
};

export const getTextWrapCss = (textWrap: IText['textWrap']): string => {
  switch (textWrap) {
    case 'noWrap':
      return 'white-space: nowrap;';
    case 'breakWord':
      return 'word-wrap: break-word;';
    case 'ellipsis':
      return `
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
    case 'normal':
    default:
      return '';
  }
};

export const getTextCss = (props: IText): string => `
  font-family: "Alegreya Sans",sans-serif;
  font-kerning: auto;
  font-variant-ligatures: common-ligatures;
  line-height: 1.55;
  ${getTextWrapCss(props.textWrap)}
  ${props.size ? `font-size: ${props.size}` : getTextSize(props.component)}
  color: ${getColor(
    props.color ? props.color : defaultProps.color!,
    props.colorVariant
  )};
  ${props.fontStyle ? `font-style: ${props.fontStyle};` : ''}
  ${props.fontWeight ? `font-weight: ${props.fontWeight}` : ''}
  margin: ${props.gutter ? `0 0 1em` : '0'};
  padding: 0;
  ${props.textTransform ? `text-transform: ${props.textTransform};` : ''}
`;

/**
 * Text component
 */
const Text: React.SFC<IText & DefaultProps> = ({
  component,
  children,
  color,
  gutter,
  textTransform,
  fontStyle,
  fontWeight,
  textWrap,
  ...rest
}) => {
  const Component = component!;
  return <Component {...rest}>{children}</Component>;
};

Text.defaultProps = defaultProps;

export default styled(Text)`
  ${getTextCss};
`;
