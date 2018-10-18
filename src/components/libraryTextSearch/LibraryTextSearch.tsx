import * as React from 'react';
import {
  UPDATE_NODES_FILTERS,
  UpdateNodesFiltersMutation
} from 'src/components/library/queries';
import { getColor } from 'src/utils';
import styled from 'styled-components';

/**
 * Styled components
 */
const Container = styled.input`
  width: 100%;
  padding: 1em;
  border: none;
  border-bottom: solid 2px ${getColor('vividPink')};
`;

const updateQueryString = (updateNodesFilters: (value: any) => void, e: any) =>
  updateNodesFilters({ variables: { queryString: e.target.value } });

/**
 * LibraryTextSearch: renders text search component for Library
 */
const LibraryTextSearch = () => (
  <UpdateNodesFiltersMutation mutation={UPDATE_NODES_FILTERS}>
    {updateNodesFilters => (
      <Container
        onChange={updateQueryString.bind(null, updateNodesFilters)}
        placeholder="Type to search for classes..."
      />
    )}
  </UpdateNodesFiltersMutation>
);

export default LibraryTextSearch;
