import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { LibraryClassButton, Text } from 'src/components';
import { sectionPadding } from 'src/components/section/Section';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Types
 */
export interface ILibraryClassSelection {
  selectedClasses: string[];
}

/**
 * Styled components
 */
const Container = styled.div`
  padding: ${sectionPadding};
`;

const SelectedClasses = styled.ul`
  list-style: none;
  padding: 0.25em;
  border: 2px dashed ${getColor('gray', 'gray5')};
`;

const NoClassesContainer = styled.div`
  padding: 0.5em 1em;
`;

/**
 * LibraryClassSelection: renders selected classes in Library
 */
const LibraryClassSelection: React.SFC<ILibraryClassSelection> = ({
  selectedClasses
}) => (
  <Container>
    <Text fontWeight="bold">In playground</Text>
    <SelectedClasses>
      {!selectedClasses.length && (
        <NoClassesContainer>
          <Text color="gray" colorvariant="gray4">
            No active classes in the playground
          </Text>
        </NoClassesContainer>
      )}
      {selectedClasses.map((classId: any, i: number) => (
        <Query
          key={i}
          variables={{ id: classId }}
          query={gql`
            query TypeIntrospection($id: String!) {
              class(id: $id) @client {
                id
                classType
              }
            }
          `}
        >
          {(classQuery: any) => {
            if (classQuery.loading) {
              return 'Loading...';
            }

            if (classQuery.error) {
              return `Error! ${classQuery.error.message}`;
            }

            if (!classQuery.data) {
              // TODO: Replace with proper message
              return null;
            }

            return <LibraryClassButton id={classId} renderSelected={true} />;
          }}
        </Query>
      ))}
    </SelectedClasses>
  </Container>
);

export default LibraryClassSelection;
