import { Typography } from '@material-ui/core';
import * as React from 'react';
import { Filter, Section } from 'src/components';
import {
  META_TYPE_QUERY,
  MetaTypeQuery,
  SELECTED_CLASS_QUERY,
  SelectedClassQuery
} from 'src/components/filters/queries';
import styled from 'styled-components';

/**
 *
 */

const TextContainer = styled.div`
  padding: 2em;
`;

const defaultErrorMessage = 'An error has occured';

/**
 * Dynamically fetches filters for a specific Class
 */
const Filters = () => (
  <SelectedClassQuery query={SELECTED_CLASS_QUERY}>
    {selectedClassQuery => {
      /**
       * Get the Class that is selected on canvas
       */
      if (selectedClassQuery.loading) {
        return 'Loading...';
      }

      if (selectedClassQuery.error || !selectedClassQuery.data) {
        return (
          <Section title={`Filters`}>
            <TextContainer>
              <Typography color="error">
                {(selectedClassQuery.error &&
                  selectedClassQuery.error.message) ||
                  defaultErrorMessage}
              </Typography>
            </TextContainer>
          </Section>
        );
      }

      const { name } = selectedClassQuery.data.canvas.selectedClass;

      if (name === '') {
        return (
          <Section title={`Filters`}>
            <TextContainer>
              <Typography>
                Please select a class from the canvas to display filters
              </Typography>
            </TextContainer>
          </Section>
        );
      }

      /**
       * Get the meta information for the selected Class
       */
      return (
        <Section title={`Filters for ${name}`}>
          <MetaTypeQuery
            query={META_TYPE_QUERY}
            variables={{ typename: `Meta${name}` }}
          >
            {metaTypeQuery => {
              if (metaTypeQuery.loading) {
                return 'Loading...';
              }

              if (
                metaTypeQuery.error ||
                !metaTypeQuery.data ||
                !metaTypeQuery.data.__type
              ) {
                return (
                  <TextContainer>
                    <Typography>
                      {(metaTypeQuery.error && metaTypeQuery.error.message) ||
                        defaultErrorMessage}
                    </Typography>
                  </TextContainer>
                );
              }

              const filters = metaTypeQuery.data.__type.fields;

              /**
               * Render a filter component for each meta field
               */
              return filters
                .filter(filter => filter.name !== 'meta')
                .map((filter, i) => (
                  <Filter
                    key={i}
                    name={filter.name}
                    typename={filter.type.name}
                  />
                ));
            }}
          </MetaTypeQuery>
        </Section>
      );
    }}
  </SelectedClassQuery>
);

export default Filters;
