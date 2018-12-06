import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';

/**
 * Types
 */
export interface ICanvasClassNodeCounterProps
  extends WithStyles<typeof styles> {
  borderColor: string;
  classId: string;
  theme?: Theme;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    circle: {
      alignItems: 'center',
      backgroundColor: theme.palette.common.white,
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: '2px',
      display: 'flex',
      height: '26px',
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      top: 0,
      width: '26px'
    },
    text: {
      fill: theme.palette.grey[800],
      fontSize: '16px',
      fontWeight: 'bold'
    }
  });

/**
 * Functions
 */
const createOperand = (path: string[], value: any, operator: string) => {
  if (typeof value === 'string') {
    return {
      operator,
      path,
      valueString: value
    };
  } else if (typeof value === 'number') {
    return {
      operator,
      path,
      valueInt: value
    };
  } else if (typeof value === 'boolean' && value === true) {
    return {
      operator,
      path,
      valueBoolean: value
    };
  }
  return null;
};

const createFilters = (path: string[], filters: any) => {
  const keys = Object.keys(filters);
  let operands: any[] = [];
  if (keys.length) {
    keys.map(key => {
      const filter = filters[key];
      const newPath = [...path, key];
      let operator = 'Equal';

      if (Array.isArray(filter)) {
        if (typeof filter[0] === 'string') {
          operands.push({
            operands: filter.map(filterItem => {
              return createOperand(newPath, filterItem, operator);
            }),
            operator: 'Or'
          });
        } else if (typeof filter[0] === 'number') {
          operands.push({
            operands: filter.map((filterItem, i) => {
              operator = i === 0 ? 'GreaterThanEqual' : 'LessThanEqual';
              return createOperand(newPath, filterItem, operator);
            }),
            operator: 'And'
          });
        }
      } else {
        operands.push(createOperand(newPath, filter, operator));
      }
    });

    operands = operands.filter(Boolean);

    if (operands.length === 0) {
      return null;
    }

    return {
      operands,
      operator: 'And'
    };
  }
  return null;
};

/**
 * CanvasClassNodeCounte component
 */
const CanvasClassNodeCounter: React.SFC<ICanvasClassNodeCounterProps> = ({
  borderColor,
  classes,
  classId
}) => {
  const Circle = ({ count }: { count?: number | string }) => (
    <div className={classes.circle} style={{ borderColor }}>
      <Typography className={classes.text}>{count || '?'}</Typography>
    </div>
  );

  return (
    <Query
      query={gql`
        query Class($id: String!) {
          class(id: $id) @client {
            instance
            name
            classLocation
            classType
            filters
          }
        }
      `}
      variables={{ id: classId }}
    >
      {classQuery => {
        const {
          classLocation,
          classType,
          filters,
          instance,
          name
        } = classQuery.data.class;
        const isNetwork = classLocation !== instance;
        const path = [classType, name];
        const where = createFilters(path, JSON.parse(filters));

        const queryString = `
          query CanvasClassNodeCounterQuery($where: WeaviateLocalGetMetaWhereInpObj) {
            ${classLocation} {
              ${isNetwork ? `${instance} {` : ''}
                GetMeta(where: $where) {
                  ${classType} {
                    ${name} {
                      meta {
                        count
                      }
                    }
                  }
                }
              ${isNetwork ? '}' : ''}
            }
          }
        `;

        return (
          <Query query={gql(queryString)} variables={{ where }}>
            {canvasClassNodeCounterQuery => {
              if (canvasClassNodeCounterQuery.loading) {
                return <Circle count="..." />;
              }

              if (canvasClassNodeCounterQuery.error) {
                return <Circle count="!" />;
                // canvasClassNodeCounterQuery.error.message;
              }

              if (!canvasClassNodeCounterQuery.data) {
                // TODO: Replace with proper message
                return null;
              }

              const count = isNetwork
                ? canvasClassNodeCounterQuery.data[classLocation][instance]
                    .GetMeta[classType][name].meta.count
                : canvasClassNodeCounterQuery.data[classLocation].GetMeta[
                    classType
                  ][name].meta.count;
              return <Circle count={count} />;
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default withStyles(styles)(CanvasClassNodeCounter);
