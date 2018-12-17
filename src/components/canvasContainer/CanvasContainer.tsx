import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';
import { Canvas } from 'src/components';
import {
  SELECTED_CLASSES_QUERY,
  SelectedClassesQuery
} from '../library/queries';

/**
 * Types
 */
export interface ICanvasContainerProps extends WithStyles<typeof styles> {}

export interface ICanvasContainerState {
  height: number;
  width: number;
}

/**
 * Styles
 */
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
      <SelectedClassesQuery query={SELECTED_CLASSES_QUERY}>
        {(selectedClassesQuery: any) => {
          if (selectedClassesQuery.loading) {
            return <p>Loading....</p>;
          }

          if (selectedClassesQuery.error) {
            return null;
          }

          if (!selectedClassesQuery.data || !selectedClassesQuery.data.canvas) {
            return null;
          }

          const selectedClasses =
            selectedClassesQuery.data.canvas.selectedClasses;

          return (
            <div className={classes.root}>
              <Canvas
                selectedClasses={selectedClasses}
                height={height}
                width={width}
              />
            </div>
          );
        }}
      </SelectedClassesQuery>
    );
  }
}

export default withStyles(styles)(CanvasContainer);
