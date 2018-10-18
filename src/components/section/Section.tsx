import * as React from 'react';
import { Text } from 'src/components';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Types
 */
export interface ISectionProps {
  title: string;
}

export interface ISectionState {
  isOpen: boolean;
}

/**
 * Styled components
 */
export const sectionPadding = '0.5em';

const Container = styled.section`
  min-width: 500px;
  margin-bottom: 0.25em;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
`;

const SectionHeader = styled.button`
  display: flex;
  width: 100%;
  padding: 1.6em;
  background-color: ${getColor('almostBlack')};
  border: none;
`;

const SectionContent = styled.div`
  background-color: ${getColor('white')};
  overflow: hidden;
`;

/**
 * Section component: renders main sections in App
 */
class Section extends React.Component<ISectionProps, ISectionState> {
  constructor(props: ISectionProps) {
    super(props);
    this.state = {
      isOpen: true
    };
  }

  public toggleSection = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  public render() {
    const { children, title } = this.props;
    const { isOpen } = this.state;
    return (
      <Container>
        <SectionHeader onClick={this.toggleSection}>
          <Text color="white" textTransform="uppercase" fontWeight="bold">
            {title}
          </Text>
        </SectionHeader>
        {isOpen && <SectionContent>{children}</SectionContent>}
      </Container>
    );
  }
}

export default Section;
