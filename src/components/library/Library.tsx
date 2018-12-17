import * as React from 'react';
import {
  LibraryClasses,
  LibraryClassSelection,
  LibraryFilters,
  LibraryTextSearch,
  Section
} from 'src/components';
import {
  CLASSES_FILTERS_QUERY,
  ClassesFiltersQuery,
  SELECTED_CLASSES_QUERY,
  SelectedClassesQuery
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
    <ClassesFiltersQuery query={CLASSES_FILTERS_QUERY}>
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

            <SelectedClassesQuery query={SELECTED_CLASSES_QUERY}>
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
            </SelectedClassesQuery>
          </React.Fragment>
        );
      }}
    </ClassesFiltersQuery>
  </Section>
);

export default Library;
