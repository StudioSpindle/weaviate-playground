import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { Canvas } from 'src/components';

// import data from './data';

export interface ICanvasContainerProps extends WithStyles<typeof styles> {}

export interface ICanvasContainerState {
  height: number;
  width: number;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      justifyContent: 'center'
    }
  });

class CanvasContainer extends React.Component<
  ICanvasContainerProps,
  ICanvasContainerState
> {
  constructor(props: ICanvasContainerProps) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  public componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  public updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  public render() {
    const { classes } = this.props;
    const { height, width } = this.state;
    if (!height || !width) {
      return null;
    }

    return (
      <Query
        query={gql`
          query selectedClasses {
            canvas @client {
              selectedClasses
            }
          }
        `}
      >
        {(selectedClassesQuery: any) => {
          if (selectedClassesQuery.data.canvas) {
            const newNodes = selectedClassesQuery.data.canvas.selectedClasses.map(
              (classId: string) => ({ id: classId, group: 8 })
            );

            const newData = {
              links: [],
              nodes: [...newNodes]
            };
            return (
              <div className={classes.root}>
                <Canvas graph={newData} height={height} width={width} />
              </div>
            );
          }

          return null;
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(CanvasContainer);
