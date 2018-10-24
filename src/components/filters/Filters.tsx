import * as React from 'react';
import { Filter, Section } from 'src/components';
import {
  GET_META_TYPE,
  GET_SELECTED_NODE,
  GetMetaTypeQuery,
  GetSelectedNodeQuery
} from 'src/components/filters/queries';

/**
 * Dynamically fetches filters for a specific Node
 */
const Filters = () => (
  <GetSelectedNodeQuery query={GET_SELECTED_NODE}>
    {selectedNodeQuery => {
      /**
       * Get the Node that is selected on canvas
       */
      if (selectedNodeQuery.loading) {
        return 'Loading...';
      }

      if (selectedNodeQuery.error) {
        return selectedNodeQuery.error.message;
      }

      if (!selectedNodeQuery.data) {
        // TODO: Replace with proper message
        return null;
      }

      const selectedNode = selectedNodeQuery.data.canvas.selectedNode;

      /**
       * Get the meta information for the selected Node
       */
      return (
        <Section title={`Filters for ${selectedNode}`}>
          <GetMetaTypeQuery
            query={GET_META_TYPE}
            variables={{ typename: `Meta${selectedNode}` }}
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
  </GetSelectedNodeQuery>
);

export default Filters;
