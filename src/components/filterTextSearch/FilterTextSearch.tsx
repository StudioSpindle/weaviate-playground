import { createStyles, WithStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { FilterTextSearchButton } from 'src/components';
import { IDefaultFilterProps } from 'src/components/filter/Filter';

/**
 * Types
 */
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

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '100%'
    },
    focused: {
      color: theme.palette.secondary.main
    },
    input: {
      fontSize: '1rem',
      padding: '8px 24px'
    },
    root: {
      marginTop: 0
    },
    textField: {
      width: '100%'
    },
    underline: {
      '&:after': {
        borderBottomColor: theme.palette.primary.main
      },
      '&:before': {
        borderBottomColor: theme.palette.primary.main
      }
    }
  });

/**
 * Component
 */
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
      <div className={classes.container}>
        <TextField
          // InputLabelProps={{ classes: { focused: classes.focused } }}
          classes={{ root: classes.root }}
          InputProps={{
            classes: { root: classes.input, underline: classes.underline }
          }}
          className={classes.textField}
          placeholder={`Filter by ${name}`}
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
