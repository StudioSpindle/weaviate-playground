import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import get from 'get-value';
import React from 'react';
import { LibraryClassButton } from 'src/components';
import { CLASS_IDS_QUERY, ClassIdsQuery } from './queries';

/**
 * Types
 */
interface ILibraryClassesProps extends WithStyles<typeof styles> {}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    list: {
      listStyleType: 'none'
    },
    noClassesContainer: {
      padding: '0.5em 1em'
    },
    noClassesText: {
      color: theme.palette.primary.main,
      textAlign: 'center'
    },
    unselectedClassesContainer: {
      border: `1px solid ${theme.palette.grey[200]}`,
      marginBottom: '1rem',
      marginTop: '.5rem',
      maxHeight: '22vh', // caps it around 5 items
      overflowY: 'auto',
      padding: '0.25em'
    }
  });

/**
 * LibraryClasses: fetches classes for selection made in Library
 */
class LibraryClasses extends React.Component<ILibraryClassesProps> {
  public render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Typography variant={'subtitle1'}>Other Schema items</Typography>

        <div className={classes.unselectedClassesContainer}>
          <ClassIdsQuery query={CLASS_IDS_QUERY} fetchPolicy="cache-only">
            {({ loading, error, data }) => {
              if (loading || error) {
                // tslint:disable-next-line:no-console
                console.log(loading || error);
              }

              const classIds = (data && get(data, 'canvas.classIds')) || [];

              if (!classIds.length) {
                return (
                  <div className={classes.noClassesContainer}>
                    <Typography className={classes.noClassesText}>
                      No classes defined yet
                    </Typography>
                  </div>
                );
              }

              return (
                <ul
                  className={classes.list}
                  id="library-class-button-container"
                >
                  {classIds.map((classId: string, i: number) => (
                    <LibraryClassButton
                      key={`${classId}${i}`}
                      id={classId}
                      renderSelected={false}
                    />
                  ))}
                </ul>
              );
            }}
          </ClassIdsQuery>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(LibraryClasses);
