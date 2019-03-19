import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { OntologyEditorClass, OntologyEditorProperty } from 'src/components';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IOntologyEditorProps extends WithStyles<typeof styles> {}

export interface IOntologyEditorState {
  isDrawerOpen: boolean;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    drawer: {
      backgroundColor: theme.palette.grey[100],
      minWidth: '600px'
    },
    grow: {
      flexGrow: 1
    },
    ontologyActionsContainer: {
      padding: '0.25em'
    },
    paper: {
      margin: '1em'
    },
    paperBody: {
      padding: '1em'
    },
    paperContainer: {
      padding: '1em'
    }
  });

/**
 * Component
 */
class OntologyEditor extends React.Component<
  IOntologyEditorProps,
  IOntologyEditorState
> {
  constructor(props: IOntologyEditorProps) {
    super(props);
    this.state = {
      isDrawerOpen: false
    };
  }

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;

    this.setState({
      isDrawerOpen: !isDrawerOpen
    });
  };

  public render() {
    const { isDrawerOpen } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.ontologyActionsContainer}>
        <Button variant="outlined" onClick={this.toggleDrawer}>
          <Typography>Create schema item</Typography>
        </Button>

        <Drawer
          open={isDrawerOpen}
          onClose={this.toggleDrawer}
          classes={{ paper: classes.drawer }}
        >
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography color="inherit">Untitled schema item</Typography>
              <div className={classes.grow} />
              <Button
                variant="contained"
                color="primary"
                onClick={this.toggleDrawer}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <div className={classes.paperBody}>
                <Typography variant="h6">Class definition</Typography>
              </div>
              <Divider />
              <div className={classes.paperBody}>
                <OntologyEditorClass />
              </div>
            </Paper>
            <Paper className={classes.paper}>
              <div className={classes.paperBody}>
                <Typography variant="h6">Properties</Typography>
              </div>
              <Divider />
              <div className={classes.paperBody}>
                <OntologyEditorProperty />
              </div>
            </Paper>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditor);
