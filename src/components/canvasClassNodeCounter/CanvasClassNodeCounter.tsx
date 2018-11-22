import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';

/**
 * Types
 */
export interface ICanvasClassNodeCounterProps
  extends WithStyles<typeof styles> {
  classId: string;
  theme?: Theme;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    circle: {
      fill: theme.palette.common.white,
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
  classes,
  classId
}) => {
  const Circle = ({ count }: { count?: number }) => (
    <g>
      <circle className={classes.circle} cx="45" cy="-45" r={15} />
      <text x="45" y="-42.5" className={classes.text}>
        {count || '...'}
      </text>
    </g>
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
        // tslint:disable-next-line:no-console
        console.log(where);

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
                return <Circle />;
              }

              if (canvasClassNodeCounterQuery.error) {
                return canvasClassNodeCounterQuery.error.message;
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
              return <Circle count={count as number} />;
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default withStyles(styles)(CanvasClassNodeCounter);
