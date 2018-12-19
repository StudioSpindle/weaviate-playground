import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Tag } from 'src/components';
import {
  ActionIcon,
  AddIcon,
  CheckIcon,
  ThingIcon
} from 'src/components/icons';
import {
  LIBRARY_CLASS_BUTTON_QUERY,
  LibraryClassButtonQuery,
  SELECTED_CLASSES_MUTATION,
  SelectedClassesMutation
} from 'src/components/libraryClassButton/queries';

/**
 * Types
 */
export interface ILibraryClassProps extends WithStyles<typeof styles> {
  id: string;
  renderSelected: boolean;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    button: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main
      },
      border: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '1em',
      paddingTop: '1em',
      width: '100%'
    },
    iconContainer: {
      display: 'flex',
      marginLeft: '24px',
      marginRight: '1em'
    },
    iconNameContainer: {
      display: 'flex'
    }
  });

const iconSize = 24;
const iconProps = {
  height: iconSize + 'px',
  isFilled: true,
  width: iconSize + 'px'
};

const updateSelection = (updateSelectedClasses: any, id: string) =>
  updateSelectedClasses({ variables: { id } });

/**
 * LibraryClassButton component: renders button used for each class in Library
 */
const LibraryClassButton: React.SFC<ILibraryClassProps> = ({
  classes,
  id,
  renderSelected
}: ILibraryClassProps) => (
  <LibraryClassButtonQuery
    query={LIBRARY_CLASS_BUTTON_QUERY}
    variables={{ id }}
  >
    {classQuery => {
      if (classQuery.loading) {
        return (
          <li>
            <button className={classes.button}>
              <div>
                <Typography>Loading...</Typography>
              </div>
            </button>
          </li>
        );
      }

      if (classQuery.error) {
        return (
          <li>
            <button className={classes.button}>
              <div>
                <Typography>${classQuery.error.message}</Typography>
              </div>
            </button>
          </li>
        );
      }

      if (!classQuery.data) {
        return (
          <li>
            <button className={classes.button}>
              <div>
                <Typography>An error has occured</Typography>
              </div>
            </button>
          </li>
        );
      }

      const {
        instance,
        isSelected,
        name,
        classLocation,
        classType
      } = classQuery.data.class;
      const classesFilters = classQuery.data.classesFilters;

      /**
       * Do not render buttons that do not filter criteria
       */
      if (
        !renderSelected &&
        (isSelected ||
          (classesFilters.classType !== 'All' &&
            classType !== classesFilters.classType) ||
          classLocation !== classesFilters.classLocation ||
          !name
            .toLowerCase()
            .includes(classesFilters.queryString.toLowerCase()))
      ) {
        return null;
      }

      return (
        <SelectedClassesMutation
          mutation={SELECTED_CLASSES_MUTATION}
          variables={{ id }}
        >
          {(updateSelectedClasses: any) => (
            <li>
              <button
                className={classes.button}
                onClick={updateSelection.bind(null, updateSelectedClasses, id)}
              >
                <div className={classes.iconNameContainer}>
                  <div className={classes.iconContainer}>
                    {classType === 'Things' && <ThingIcon {...iconProps} />}
                    {classType === 'Actions' && <ActionIcon {...iconProps} />}
                  </div>
                  <Typography>
                    {name} <Tag>{instance}</Tag>
                  </Typography>
                </div>

                <div className={classes.iconContainer}>
                  {isSelected ? (
                    <CheckIcon width="24px" height="24px" color="vividPink" />
                  ) : (
                    <AddIcon width="24px" height="24px" />
                  )}
                </div>
              </button>
            </li>
          )}
        </SelectedClassesMutation>
      );
    }}
  </LibraryClassButtonQuery>
);

export default withStyles(styles)(LibraryClassButton);
