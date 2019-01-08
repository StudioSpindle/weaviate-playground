import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import {
  UPDATE_CLASSES_FILTERS,
  UpdateClassesFiltersMutation
} from 'src/components/library/queries';

/**
 * Types
 */
interface ILibraryTextSearchProps extends WithStyles<typeof styles> {}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    container: {
      border: 'none',
      borderBottom: `solid 2px ${theme.palette.primary.main}`,
      padding: '18px 24px'
    }
  });

const updateQueryString = (
  updateClassesFilters: (value: any) => void,
  e: any
) => updateClassesFilters({ variables: { queryString: e.target.value } });

/**
 * LibraryTextSearch: renders text search component for Library
 */
const LibraryTextSearch: React.SFC<ILibraryTextSearchProps> = ({ classes }) => (
  <UpdateClassesFiltersMutation mutation={UPDATE_CLASSES_FILTERS}>
    {updateClassesFilters => (
      <input
        className={classes.container}
        onChange={updateQueryString.bind(null, updateClassesFilters)}
        placeholder="Type to search for classes..."
      />
    )}
  </UpdateClassesFiltersMutation>
);

export default withStyles(styles)(LibraryTextSearch);
