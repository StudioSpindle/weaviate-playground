import * as React from 'react';
import { Text } from 'src/components';
import { IText } from 'src/components/text/Text';
import styled from 'styled-components';

/**
 * Types
 */
type TagProps = IText;

/**
 * Styled components
 */
// TODO: load typed color
const Container = styled.code`
  margin: 0 1px;
  background: #f2f4f5;
  padding: 0.1em 0.2em;
  border-radius: 3px;
  border: 1px solid #eee;
`;

/**
 * Tag component
 */
const Tag: React.SFC<TagProps> = ({ children, ...textProps }) => (
  <Container>
    <Text size="0.9em" {...textProps}>
      {children}
    </Text>
  </Container>
);

export default Tag;
