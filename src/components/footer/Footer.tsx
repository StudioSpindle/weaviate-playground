import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

interface IFooterProps extends WithStyles<typeof styles> {}

const styles = (theme: Theme) => ({
  appBar: {
    bottom: 0,
    top: 'auto'
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

/**
 * Footer component
 */
class Footer extends React.Component<IFooterProps> {
  public render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="fixed"
        color="inherit"
        className={classes.appBar}
        elevation={0}
      >
        <Divider />
        <Toolbar variant="dense">
          <Typography color="inherit">Add nodes from the library</Typography>
          <div className={classes.grow} />
          <Button
            variant="text"
            color="secondary"
            component="a"
            href={`${window.location.href}&graphiql=true`}
            target="_blank"
          >
            <Typography>GraphiQL</Typography>
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Footer);
