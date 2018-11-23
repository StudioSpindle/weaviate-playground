import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as d3 from 'd3';
import gql from 'graphql-tag';
import * as React from 'react';
import { compose, Mutation, Query } from 'react-apollo';
import { CanvasClassNodeCounter } from 'src/components';
import { ID3Node } from 'src/types';

export interface ICanvasClassProps extends WithStyles<typeof styles> {
  classId: string;
  node: ID3Node;
  theme: Theme;
}

const styles = (theme: Theme) =>
  createStyles({
    circle: {
      stroke: theme.palette.secondary.main,
      strokeWidth: 2
    },
    text: {
      fill: theme.palette.grey[800],
      fontFamily: theme.typography.fontFamily,
      fontSize: '16px',
      fontWeight: 'bold',
      textAnchor: 'middle'
    }
  });

class CanvasClass extends React.Component<ICanvasClassProps> {
  public ref: SVGCircleElement;

  public componentDidMount() {
    this.selectD3Class();
  }

  public componentDidUpdate() {
    // this.selectClass();
  }

  public selectD3Class() {
    const { node } = this.props;
    d3.select(this.ref).data([node]);
  }

  public selectClass = (selectClassMutation: any) => {
    selectClassMutation();
  };

  public render() {
    const { classes, classId, theme } = this.props;

    return (
      <g className="node" ref={(ref: SVGCircleElement) => (this.ref = ref)}>
        <Query
          query={gql`
            query classSelected($id: String!) {
              class(id: $id) @client {
                isSelected
                instance
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
                  const selectedClassId = canvasClassQuery.data.canvas.selectedClass.id.replace(
                    '__ClientData:',
                    ''
                  );
                  const isSelected = selectedClassId === classId;
                  const fill = isSelected
                    ? theme.palette.secondary.light
                    : theme.palette.common.white;

                  return (
                    <React.Fragment>
                      <circle
                        className={classes.circle}
                        r={60}
                        cx="0"
                        cy="0"
                        fill={fill}
                        onClick={this.selectClass.bind(
                          null,
                          selectClassMutation
                        )}
                      />
                      <text className={classes.text} x="0" y="2.5">
                        {canvasClassQuery.data.class.name}
                      </text>
                      <CanvasClassNodeCounter classId={classId} />
                    </React.Fragment>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
      </g>
    );
  }
}

export default compose(
  withStyles(styles),
  withTheme()
)(CanvasClass);
