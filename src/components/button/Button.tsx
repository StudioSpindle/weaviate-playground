import * as React from 'react';
import { Text } from 'src/components';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Types
 */
export interface IButton extends IButtonContainer {
  icon?: JSX.Element;
  title: string;
  value: any;
}

export interface IButtonContainer {
  isSelected?: boolean;
  onClick: (value: any) => void;
}

/**
 * Styled components
 */
const Container = styled<IButtonContainer, 'button'>('button')`
  display: flex;
  margin: 0.5em;
  padding: 0.5em 1em;
  border: 1px solid
    ${props =>
      props.isSelected ? getColor('vividPink') : getColor('almostBlack')};
  background-color: ${props =>
    props.isSelected ? getColor('vividPink') : 'transparent'};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 0.5em;
`;

/**
 * Button component: renders default button with optional icon
 */
const Button: React.SFC<IButton> = ({ icon, isSelected, onClick, title }) => (
  <Container isSelected={isSelected} onClick={onClick}>
    {icon && <IconContainer>{icon}</IconContainer>}
    <Text
      component="span"
      color={isSelected ? 'white' : 'almostBlack'}
      fontWeight="bold"
      size="1em"
    >
      {title}
    </Text>
  </Container>
);

export default Button;
