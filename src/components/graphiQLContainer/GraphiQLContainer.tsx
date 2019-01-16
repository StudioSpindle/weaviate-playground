import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import * as React from 'react';

export interface IGraphiQLContainer extends WithStyles<typeof styles> {}

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';

const graphQLFetcher = (graphQLParams: any) =>
  fetch(uri, {
    body: JSON.stringify(graphQLParams),
    headers: { 'Content-Type': 'application/json' },
    method: 'post'
  }).then(response => response.json());

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative'
    },
    flex: {
      flex: 1
    },
    grow: {
      flexGrow: 1
    }
  });

class GraphiQLContainer extends React.Component<IGraphiQLContainer> {
  public state = {
    open: false
  };

  public transition = () => {
    return <Slide direction="up" {...this.props} />;
  };

  public handleClickOpen = () => {
    this.setState({ open: true });
  };

  public handleClose = () => {
    this.setState({ open: false });
  };

  public render() {
    const { classes } = this.props;

    return (
      <div>
        <Button variant="text" color="secondary" onClick={this.handleClickOpen}>
          <Typography>GraphiQL</Typography>
        </Button>

        <Dialog
          fullScreen={true}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <AppBar className={classes.appBar}>
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit">
                Weaviate Playground
              </Typography>
              <div className={classes.grow} />
              <Button
                variant="text"
                color="secondary"
                onClick={this.handleClose}
              >
                <Typography>Close</Typography>
              </Button>
            </Toolbar>
          </AppBar>
          <GraphiQL fetcher={graphQLFetcher} />;
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(GraphiQLContainer);
