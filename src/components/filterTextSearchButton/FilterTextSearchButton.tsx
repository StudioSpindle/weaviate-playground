import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { IDefaultFilterProps } from 'src/components/filter/Filter';
import {
  TOGGLE_FILTER_TEXT_SEARCH_MUTATION,
  ToggleFilterTextSearchButtonMutation
} from './queries';

export interface IFilterTextSearchListItemProps extends IDefaultFilterProps {
  value: string;
}
const handleToggle = (handleToggleMutation: any) => {
  handleToggleMutation();
};

const FilterTextSearchListItem: React.SFC<IFilterTextSearchListItemProps> = ({
  classId,
  filterName,
  filterType,
  filterValue = [],
  value
}) => (
  <ToggleFilterTextSearchButtonMutation
    mutation={TOGGLE_FILTER_TEXT_SEARCH_MUTATION}
    variables={{
      classId,
      filterName,
      filterType,
      value
    }}
  >
    {handleToggleMutation => (
      <ListItem
        role={undefined}
        button={true}
        onClick={handleToggle.bind(null, handleToggleMutation)}
        dense={true}
      >
        <ListItemText primary={value} />
        <Checkbox
          disableRipple={true}
          tabIndex={-1}
          checked={(filterValue as string[]).includes(value)}
        />
      </ListItem>
    )}
  </ToggleFilterTextSearchButtonMutation>
);
export default FilterTextSearchListItem;
