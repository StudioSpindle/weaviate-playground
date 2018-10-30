import * as React from 'react';
import { Filter, Section } from 'src/components';
import {
  GET_META_TYPE,
  GET_SELECTED_CLASS,
  GetMetaTypeQuery,
  GetSelectedClassQuery
} from 'src/components/filters/queries';

/**
 * Dynamically fetches filters for a specific Class
 */
const Filters = () => (
  <GetSelectedClassQuery query={GET_SELECTED_CLASS}>
    {selectedClassQuery => {
      /**
       * Get the Class that is selected on canvas
       */
      if (selectedClassQuery.loading) {
        return 'Loading...';
      }

      if (selectedClassQuery.error) {
        return selectedClassQuery.error.message;
      }

      if (!selectedClassQuery.data) {
        // TODO: Replace with proper message
        return null;
      }

      const selectedClass = selectedClassQuery.data.canvas.selectedClass;

      /**
       * Get the meta information for the selected Class
       */
      return (
        <Section title={`Filters for ${selectedClass}`}>
          <GetMetaTypeQuery
            query={GET_META_TYPE}
            variables={{ typename: `Meta${selectedClass}` }}
          >
            {metaTypeQuery => {
              if (metaTypeQuery.loading) {
                return 'Loading...';
              }

              if (metaTypeQuery.error) {
                return metaTypeQuery.error.message;
              }

              if (!metaTypeQuery.data) {
                // TODO: Replace with proper message
                return null;
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
          </GetMetaTypeQuery>
        </Section>
      );
    }}
  </GetSelectedClassQuery>
);

export default Filters;
