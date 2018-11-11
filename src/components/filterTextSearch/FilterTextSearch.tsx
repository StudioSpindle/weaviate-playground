import { createStyles, WithStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { FilterTextSearchButton } from 'src/components';
import { IDefaultFilterProps } from 'src/components/filter/Filter';

export interface IFilterTextSearchProps
  extends WithStyles<typeof styles>,
    IDefaultFilterProps {
  filter?: string[];
  items: [{ occurs: number; value: string }];
  name: string;
}

export interface IFilterTextSearchState {
  value: string;
}

const styles = (theme: Theme) =>
  createStyles({
    focused: {
      color: theme.palette.secondary.main
    },
    textField: {
      width: '100%'
    },
    underline: {
      '&:after': {
        borderBottomColor: theme.palette.primary.main
      }
    }
  });

class FilterTextSearch extends React.Component<
  IFilterTextSearchProps,
  IFilterTextSearchState
> {
  constructor(props: IFilterTextSearchProps) {
    super(props);
    this.state = {
      value: ''
    };
  }

  public handleChange = (e: any) => {
    this.setState({ value: e.target.value });
  };

  public render() {
    const {
      classId,
      filterName,
      filterType,
      filterValue,
      classes,
      items,
      name
    } = this.props;
    const { value } = this.state;

    return (
      <div>
        <TextField
          // InputLabelProps={{ classes: { focused: classes.focused } }}
          InputProps={{ classes: { underline: classes.underline } }}
          className={classes.textField}
          label={`Filter by ${name}`}
          value={this.state.value}
          onChange={this.handleChange}
          margin="normal"
        />
        <List dense={true}>
          {items
            .filter(item =>
              item.value.toLowerCase().includes(value.toLowerCase())
            )
            .map(item => (
              <FilterTextSearchButton
                key={item.value}
                classId={classId}
                filterName={filterName}
                filterType={filterType}
                filterValue={filterValue}
                value={item.value}
              />
            ))}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(FilterTextSearch);
