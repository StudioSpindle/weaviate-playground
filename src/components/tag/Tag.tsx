import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import styled from 'styled-components';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
interface ITagProps {}

/**
 * Styled components
 */
// TODO: load typed color
const Container = styled.code`
  display: inline-flex;
  margin: 0 1px;
  background: #f2f4f5;
  padding: 0.1em 0.2em;
  border-radius: 3px;
  border: 1px solid #eee;
`;

/**
 * Tag component
 */
const Tag: React.SFC<ITagProps> = ({ children }) => (
  <Container>
    <Typography variant="caption">{children}</Typography>
  </Container>
);

export default Tag;
