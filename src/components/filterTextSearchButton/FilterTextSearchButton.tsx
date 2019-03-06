import { createStyles, WithStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import React from 'react';
import { IDefaultFilterProps } from 'src/components/filter/Filter';
import {
  TOGGLE_FILTER_TEXT_SEARCH_MUTATION,
  ToggleFilterTextSearchButtonMutation
} from './queries';

/**
 * Types
 */
export interface IFilterTextSearchListItemProps
  extends WithStyles<typeof styles>,
    IDefaultFilterProps {
  path?: string[];
  value: string;
}
const handleToggle = (handleToggleMutation: any) => {
  handleToggleMutation();
};

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    checkbox: {
      padding: '8px'
    },
    checkboxChecked: {
      color: theme.palette.grey[800]
    },
    gutters: {
      padding: '0 24px'
    },
    text: {
      fontSize: '1rem'
    }
  });

/**
 * FilterTextSearchListItem component
 */
const FilterTextSearchListItem: React.SFC<IFilterTextSearchListItemProps> = ({
  classId,
  classes,
  filterName,
  filterType,
  filterValue = [],
  path,
  value
}) => (
  <ToggleFilterTextSearchButtonMutation
    mutation={TOGGLE_FILTER_TEXT_SEARCH_MUTATION}
    variables={{
      classId,
      filterName,
      filterType,
      path,
      value
    }}
  >
    {handleToggleMutation => (
      <ListItem
        classes={{ gutters: classes.gutters }}
        role={undefined}
        button={true}
        onClick={handleToggle.bind(null, handleToggleMutation)}
        dense={true}
      >
        <ListItemText classes={{ root: classes.text }} primary={value} />
        <Checkbox
          classes={{ root: classes.checkbox }}
          color="primary"
          disableRipple={true}
          tabIndex={-1}
          checked={(filterValue as string[]).includes(value)}
        />
      </ListItem>
    )}
  </ToggleFilterTextSearchButtonMutation>
);
export default withStyles(styles)(FilterTextSearchListItem);
