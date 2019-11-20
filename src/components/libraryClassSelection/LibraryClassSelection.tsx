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
    noClassesContainer: {
      padding: '0.5em 1em'
    },
    noClassesText: {
      color: theme.palette.primary.main,
      textAlign: 'center'
    },
    // TODO: make generic component together with 'unselectedClassesContainer' in
    //  LibraryClasses.tsx (exception of components, optional border style)
    selectedClasses: {
      border: `2px dashed ${theme.palette.grey[200]}`,
      listStyle: 'none',
      marginBottom: '1rem',
      maxHeight: '22vh', // caps it around 5 items
      overflowY: 'auto',
      padding: '0.25em'
    },
    typography: {
      marginBottom: '.5rem'
    }
  });

/**
 * LibraryClassSelection: renders selected classes in Library
 */
const LibraryClassSelection: React.SFC<ILibraryClassSelection> = ({
  classes,
  selectedClasses
}) => (
  <React.Fragment>
    <Typography variant={'subtitle1'} classes={{ root: classes.typography }}>
      Schema items in playground
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
  </React.Fragment>
);

export default withStyles(styles)(LibraryClassSelection);
