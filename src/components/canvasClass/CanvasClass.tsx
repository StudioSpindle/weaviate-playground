import {
  createStyles,
  withStyles,
  WithStyles,
  withTheme
} from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { compose } from 'recompose';
import { CanvasClassNodeCounter } from 'src/components';
import {
  CLASS_SELECTION_CANVAS_MUTATION,
  UpdateClassSelectionCanvasMutation
} from 'src/resolvers/mutations';
import { ID3Node } from 'src/types';
import { ActionIcon, ThingIcon } from '../icons';
// import {
//   SELECTED_CLASSES_MUTATION,
//   SelectedClassesMutation
// } from '../libraryClassButton/queries';
import { SELECTED_CLASS_QUERY, SelectedClassQuery } from './queries';

export interface ICanvasClassProps extends WithStyles<typeof styles> {
  classId: string;
  node: ID3Node;
  theme: Theme;
}

const styles = (theme: Theme) =>
  createStyles({
    button: {
      background: theme.palette.common.white,
      border: `1px solid ${theme.palette.common.black}`,
      height: '100px',
      position: 'absolute',
      width: '100px',
      zIndex: -1
    },
    circle: {
      alignItems: 'center',
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: '2px',
      display: 'flex',
      flexDirection: 'column',
      height: '116px',
      justifyContent: 'center',
      width: '116px'
    },
    text: {
      fill: theme.palette.grey[800],
      fontSize: '16px',
      fontWeight: 'bold'
    }
  });

const iconSize = 27;
const iconProps = {
  height: iconSize + 'px',
  width: iconSize + 'px'
};

class CanvasClass extends React.Component<ICanvasClassProps> {
  public selectClass = (selectClassMutation: any) => {
    selectClassMutation();
  };

  public render() {
    const { classes, classId, theme } = this.props;

    return (
      <SelectedClassQuery
        query={SELECTED_CLASS_QUERY}
        variables={{ id: classId }}
      >
        {(canvasClassQuery: any) => {
          if (canvasClassQuery.loading) {
            return null;
          }

          if (canvasClassQuery.error) {
            return null;
          }

          if (!canvasClassQuery.data) {
            return null;
          }

          return (
            <UpdateClassSelectionCanvasMutation
              mutation={CLASS_SELECTION_CANVAS_MUTATION}
              variables={{ id: classId }}
            >
              {selectClassMutation => {
                const { selectedClass } = canvasClassQuery.data.canvas;
                const { classType, name } = canvasClassQuery.data.class;

                const selectedClassId = selectedClass.id.replace(
                  '__ClientData:',
                  ''
                );
                const isSelected = selectedClassId === classId;
                const backgroundColor = isSelected
                  ? theme.palette.secondary.light
                  : theme.palette.common.white;

                const borderColor =
                  isSelected || this.props.node.highlighted
                    ? theme.palette.secondary.main
                    : theme.palette.common.black;

                return (
                  <React.Fragment>
                    <div
                      style={{ backgroundColor, borderColor }}
                      className={classes.circle}
                      onClick={this.selectClass.bind(null, selectClassMutation)}
                    >
                      {classType === 'Things' && <ThingIcon {...iconProps} />}
                      {classType === 'Actions' && <ActionIcon {...iconProps} />}
                      <Typography className={classes.text}>{name}</Typography>
                      <CanvasClassNodeCounter
                        borderColor={borderColor}
                        classId={classId}
                      />
                    </div>

                    {/* {isSelected && (
                      <React.Fragment>
                        <button
                          className={classes.button}
                          style={{
                            borderRadius: '90px 0 0 0',
                            left: '-46px',
                            top: '-46px'
                          }}
                        >
                          <Typography>Relate</Typography>
                        </button>
                        <button
                          className={classes.button}
                          style={{
                            borderRadius: '0 90px 0 0',
                            right: '-46px',
                            top: '-46px'
                          }}
                        >
                          <Typography>Expand</Typography>
                        </button>
                        <SelectedClassesMutation
                          mutation={SELECTED_CLASSES_MUTATION}
                          variables={{ id: classId }}
                        >
                          {(updateSelectedClasses: any) => (
                            <button
                              className={classes.button}
                              style={{
                                borderRadius: '0 0 0 90px',
                                bottom: '-46px',
                                left: '-46px'
                              }}
                              onClick={updateSelectedClasses}
                            >
                              <Typography>Hide</Typography>
                            </button>
                          )}
                        </SelectedClassesMutation>
                        <button
                          className={classes.button}
                          style={{
                            borderRadius: '0 0 90px 0',
                            bottom: '-46px',
                            right: '-46px'
                          }}
                        >
                          <Typography>Pin</Typography>
                        </button>
                      </React.Fragment>
                    )} */}
                  </React.Fragment>
                );
              }}
            </UpdateClassSelectionCanvasMutation>
          );
        }}
      </SelectedClassQuery>
    );
  }
}

export default compose(
  withStyles(styles),
  withTheme()
)(CanvasClass);
