import Grid from '@material-ui/core/Grid';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { IDefaultFilterProps } from 'src/components/filter/Filter';
import {
  FILTER_TOGGLE_SWITCH_MUTATION,
  FilterToggleSwitchMutation
} from './queries';

export interface IToggleSwitchProps extends SwitchProps, IDefaultFilterProps {
  label?: string;
}

class ToggleSwitch extends React.Component<IToggleSwitchProps> {
  public handleToggle = (handleToggleMutation: any) => {
    handleToggleMutation();
  };

  public render() {
    const {
      classId,
      color = 'primary',
      filterName,
      filterType,
      filterValue,
      label,
      ...rest
    } = this.props;
    return (
      <Grid container={true} spacing={24} alignItems="center">
        <Grid item={true}>
          <FilterToggleSwitchMutation
            mutation={FILTER_TOGGLE_SWITCH_MUTATION}
            variables={{
              classId,
              filterName,
              filterType,
              value: !filterValue
            }}
          >
            {handleToggleMutation => (
              <Switch
                color={color}
                onChange={this.handleToggle.bind(null, handleToggleMutation)}
                checked={filterValue as boolean}
                {...rest}
              />
            )}
          </FilterToggleSwitchMutation>
        </Grid>
        {label && (
          <Grid item={true}>
            <Typography>{label}</Typography>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default ToggleSwitch;
