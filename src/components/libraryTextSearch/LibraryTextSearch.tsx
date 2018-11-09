import * as React from 'react';
import {
  UPDATE_CLASSES_FILTERS,
  UpdateClassesFiltersMutation
} from 'src/components/library/queries';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Styled components
 */
const Container = styled.input`
  padding: 1em;
  border: none;
  border-bottom: solid 2px ${getColor('vividPink')};
`;

const updateQueryString = (
  updateClassesFilters: (value: any) => void,
  e: any
) => updateClassesFilters({ variables: { queryString: e.target.value } });

/**
 * LibraryTextSearch: renders text search component for Library
 */
const LibraryTextSearch = () => (
  <UpdateClassesFiltersMutation mutation={UPDATE_CLASSES_FILTERS}>
    {updateClassesFilters => (
      <Container
        onChange={updateQueryString.bind(null, updateClassesFilters)}
        placeholder="Type to search for classes..."
      />
    )}
  </UpdateClassesFiltersMutation>
);

export default LibraryTextSearch;
