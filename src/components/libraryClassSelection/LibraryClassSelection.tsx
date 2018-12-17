import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { LibraryClassButton } from 'src/components';
import { CLASS_QUERY, ClassQuery } from './queries';

/**
 * Types
 */
export interface ILibraryClassSelection extends WithStyles<typeof styles> {
  selectedClasses: string[];
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: '4px'
    },
    noClassesContainer: {
      padding: '0.5em 1em'
    },
    noClassesText: {
      color: theme.palette.grey[400]
    },
    selectedClasses: {
      border: `2px dashed ${theme.palette.grey[200]}`,
      listStyle: 'none',
      padding: '0.25em'
    },
    typography: {
      fontSize: '1rem',
      fontWeight: 'bold',
      marginLeft: '20px'
    }
  });

/**
 * LibraryClassSelection: renders selected classes in Library
 */
const LibraryClassSelection: React.SFC<ILibraryClassSelection> = ({
  classes,
  selectedClasses
}) => (
  <div className={classes.container}>
    <Typography classes={{ root: classes.typography }}>
      In playground
    </Typography>
    <div className={classes.selectedClasses}>
      {!selectedClasses.length && (
        <div className={classes.noClassesContainer}>
          <Typography className={classes.noClassesText}>
            No active classes in the playground
          </Typography>
        </div>
      )}

      {selectedClasses.map((classId: any, i: number) => (
        <ClassQuery key={i} variables={{ id: classId }} query={CLASS_QUERY}>
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
        </ClassQuery>
      ))}
    </div>
  </div>
);

export default withStyles(styles)(LibraryClassSelection);
