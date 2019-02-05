import AppBar from '@material-ui/core/AppBar';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { IThemeSpec } from 'src/themes';

/**
 * Types
 */
export interface IHeaderProps extends WithStyles<typeof styles> {
  logo?: IThemeSpec['logo'];
}

/**
 * Header component: renders header
 */
const styles = (theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    }
  });

// TODO: fix styling
class Header extends React.Component<IHeaderProps> {
  public render() {
    const { classes, logo } = this.props;
    return (
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            Weaviate Playground
          </Typography>
          <div className={classes.grow} />
          <div>{logo && <img src={logo} height="30px" />}</div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
