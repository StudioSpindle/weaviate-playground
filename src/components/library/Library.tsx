import * as React from 'react';
import {
  LibraryClasses,
  LibraryClassSelection,
  LibraryFilters,
  LibraryTextSearch,
  Section
} from 'src/components';
import {
  GET_CLASSES_FILTERS,
  GET_SELECTED_CLASSES,
  GetClassesFiltersQuery,
  GetSelectedClassesQuery
} from 'src/components/library/queries';
import styled from 'styled-components';

/**
 * Styled components
 */
const ClassContainer = styled.div`
  max-height: 25vh;
  overflow: scroll;
`;

/**
 * Library component: renders class selection with filter options
 */
const Library = () => (
  <Section title="Library">
    <GetClassesFiltersQuery query={GET_CLASSES_FILTERS}>
      {classesFiltersQuery => {
        if (classesFiltersQuery.loading) {
          return 'Loading...';
        }

        if (classesFiltersQuery.error) {
          return `Error! ${classesFiltersQuery.error.message}`;
        }

        if (!classesFiltersQuery.data) {
          // TODO: Replace with proper message
          return null;
        }

        const selectedClassLocation =
          classesFiltersQuery.data.classesFilters.classLocation;
        const selectedClassType =
          classesFiltersQuery.data.classesFilters.classType;

        return (
          <React.Fragment>
            <LibraryTextSearch />
            <LibraryFilters
              selectedClassLocation={selectedClassLocation}
              selectedClassType={selectedClassType}
            />

            <GetSelectedClassesQuery query={GET_SELECTED_CLASSES}>
              {selectedClassesQuery => {
                if (selectedClassesQuery.loading) {
                  return 'Loading...';
                }

                if (selectedClassesQuery.error) {
                  return `Error! ${selectedClassesQuery.error.message}`;
                }

                if (!selectedClassesQuery.data) {
                  // TODO: Replace with proper message
                  return null;
                }
                const selectedClasses =
                  selectedClassesQuery.data.canvas.selectedClasses;
                return (
                  <ClassContainer>
                    <LibraryClassSelection selectedClasses={selectedClasses} />
                    <LibraryClasses />
                  </ClassContainer>
                );
              }}
            </GetSelectedClassesQuery>
          </React.Fragment>
        );
      }}
    </GetClassesFiltersQuery>
  </Section>
);

export default Library;
