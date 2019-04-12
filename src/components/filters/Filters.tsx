import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Filter, Section } from 'src/components';
import {
  META_TYPE_QUERY,
  MetaTypeQuery,
  SELECTED_CLASS_QUERY,
  SelectedClassQuery
} from 'src/components/filters/queries';

/**
 * Types
 */
interface IFiltersProps extends WithStyles<typeof styles> {}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    inactiveText: {
      color: theme.palette.grey[400]
    },
    textContainer: {
      padding: '2em'
    }
  });

const defaultErrorMessage = 'An error has occured';

/**
 * Dynamically fetches filters for a specific Class
 */
const Filters: React.SFC<IFiltersProps> = ({ classes }) => (
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
          <Section title="Filters" shortTitle="Flt">
            <div className={classes.textContainer}>
              <Typography color="error">
                {(selectedClassQuery.error &&
                  selectedClassQuery.error.message) ||
                  defaultErrorMessage}
              </Typography>
            </div>
          </Section>
        );
      }

      const { instance, name } = selectedClassQuery.data.canvas.selectedClass;
      const typename = `${instance === 'Local' ? '' : instance}Meta${name}`;

      if (name === '') {
        return (
          <Section title="Filters" shortTitle="Flt">
            <div className={classes.textContainer}>
              <Typography className={classes.inactiveText}>
                Please select a class from the canvas to display filters
              </Typography>
            </div>
          </Section>
        );
      }

      /**
       * Get the meta information for the selected Class
       */
      return (
        <Section
          title={`Filters for ${name} on ${instance}`}
          shortTitle="Flt"
          maxHeight="40vh"
        >
          <MetaTypeQuery query={META_TYPE_QUERY} variables={{ typename }}>
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
                  <div className={classes.textContainer}>
                    <Typography>
                      {(metaTypeQuery.error && metaTypeQuery.error.message) ||
                        defaultErrorMessage}
                    </Typography>
                  </div>
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

export default withStyles(styles)(Filters);
