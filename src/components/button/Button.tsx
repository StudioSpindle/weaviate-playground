import * as React from 'react';
import { Text } from 'src/components';
import { getColor } from 'src/utils';
import styled from 'styled-components';

export interface IButton extends IButtonContainer {
  icon?: string;
  title: string;
  value: any;
}

export interface IButtonContainer {
  isSelected?: boolean;
  onClick: (value: any) => void;
}

const Container = styled<IButtonContainer, 'button'>('button')`
  margin: 0.5em;
  padding: 0.5em 1em;
  border: 1px solid
    ${props =>
      props.isSelected ? getColor('vividPink') : getColor('almostBlack')};
  background-color: ${props =>
    props.isSelected ? getColor('vividPink') : 'transparent'};
`;

const Button = ({ icon, isSelected, onClick, title, value }: IButton) => (
  <Container isSelected={isSelected} onClick={onClick}>
    <Text component="span" color={isSelected ? 'white' : 'almostBlack'}>
      {title}
    </Text>
  </Container>
);

export default Button;
