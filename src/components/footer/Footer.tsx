import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

interface IFooterProps extends WithStyles<typeof styles> { }

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
          <Typography color="inherit">
            Weaviate Playground BETA // <a href="https://stackoverflow.com/questions/tagged/weaviate" target="_blank">request help</a> // <a href="https://github.com/semi-technologies/weaviate-playground/issues" target="_blank">report an issue</a> // Copyright © 2019 SeMI Technologies B.V. All Rights Reserved.
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Footer);
