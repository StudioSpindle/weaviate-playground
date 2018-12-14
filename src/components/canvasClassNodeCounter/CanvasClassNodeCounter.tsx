import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { createGqlFilters } from 'src/utils';

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
        const where = createGqlFilters(path, JSON.parse(filters));

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
