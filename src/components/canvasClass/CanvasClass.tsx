import {
  createStyles,
  withStyles,
  WithStyles,
  withTheme
} from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import * as React from 'react';
import { compose, Mutation, Query } from 'react-apollo';
import { CanvasClassNodeCounter } from 'src/components';
import { ID3Node } from 'src/types';
import { ActionIcon, ThingIcon } from '../icons';
import {
  UPDATE_SELECTED_CLASSES,
  UpdateSelectedClassesMutation
} from '../libraryClassButton/queries';

export interface ICanvasClassProps extends WithStyles<typeof styles> {
  classId: string;
  node: ID3Node;
  theme: Theme;
}

const styles = (theme: Theme) =>
  createStyles({
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
  isFilled: true,
  width: iconSize + 'px'
};

class CanvasClass extends React.Component<ICanvasClassProps> {
  public selectClass = (selectClassMutation: any) => {
    selectClassMutation();
  };

  public render() {
    const { classes, classId, theme } = this.props;

    return (
      <Query
        query={gql`
          query classSelected($id: String!) {
            class(id: $id) @client {
              classType
              isSelected
              name
            }
            canvas @client {
              selectedClass
            }
          }
        `}
        variables={{ id: classId }}
      >
        {(canvasClassQuery: any) => {
          if (canvasClassQuery.loading) {
            return <p>Loading local classes</p>;
          }

          if (canvasClassQuery.error) {
            return null;
          }

          if (!canvasClassQuery.data) {
            return null;
          }

          return (
            <Mutation
              mutation={gql`
                mutation updateClassSelectionCanvas($id: String!) {
                  updateClassSelectionCanvas(id: $id) @client
                }
              `}
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
                    {isSelected && (
                      <React.Fragment>
                        <button
                          style={{
                            background: theme.palette.common.white,
                            border: `1px solid ${theme.palette.common.black}`,
                            borderRadius: '90px 0 0 0',
                            height: '100px',
                            left: '-46px',
                            position: 'absolute',
                            top: '-46px',
                            width: '100px',
                            zIndex: -1
                          }}
                        >
                          <Typography>Relate</Typography>
                        </button>
                        <button
                          style={{
                            background: theme.palette.common.white,
                            border: `1px solid ${theme.palette.common.black}`,
                            borderRadius: '0 90px 0 0',
                            height: '100px',
                            position: 'absolute',
                            right: '-46px',
                            top: '-46px',
                            width: '100px',
                            zIndex: -1
                          }}
                        >
                          <Typography>Expand</Typography>
                        </button>
                        <UpdateSelectedClassesMutation
                          mutation={UPDATE_SELECTED_CLASSES}
                          variables={{ id: classId }}
                        >
                          {(updateSelectedClasses: any) => (
                            <button
                              style={{
                                background: theme.palette.common.white,
                                border: `1px solid ${
                                  theme.palette.common.black
                                }`,
                                borderRadius: '0 0 0 90px',
                                bottom: '-46px',
                                height: '100px',
                                left: '-46px',
                                position: 'absolute',
                                width: '100px',
                                zIndex: -1
                              }}
                              onClick={updateSelectedClasses}
                            >
                              <Typography>Hide</Typography>
                            </button>
                          )}
                        </UpdateSelectedClassesMutation>
                        <button
                          style={{
                            background: theme.palette.common.white,
                            border: `1px solid ${theme.palette.common.black}`,
                            borderRadius: '0 0 90px 0',
                            bottom: '-46px',
                            height: '100px',
                            position: 'absolute',
                            right: '-46px',
                            width: '100px',
                            zIndex: -1
                          }}
                        >
                          <Typography>Pin</Typography>
                        </button>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default compose(
  withStyles(styles),
  withTheme()
)(CanvasClass);
