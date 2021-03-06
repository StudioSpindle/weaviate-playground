import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { createGqlFilters, createGqlGet } from 'src/utils';
import { CLASS_QUERY, ClassQuery } from './queries';

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
class CanvasClassNodeCounter extends React.PureComponent<
  ICanvasClassNodeCounterProps
> {
  public render() {
    const { borderColor, classes, classId } = this.props;

    const Circle = ({ count }: { count?: number | string }) => (
      <div className={classes.circle} style={{ borderColor }}>
        <Typography className={classes.text}>
          {!count && count !== 0 ? '?' : count}
        </Typography>
      </div>
    );

    return (
      <ClassQuery query={CLASS_QUERY} variables={{ id: classId }}>
        {classQuery => {
          if (classQuery.loading) {
            return <Circle count="..." />;
          }

          if (classQuery.error) {
            return <Circle count="!" />;
            // classQuery.error.message;
          }

          if (!classQuery.data) {
            // TODO: Replace with proper message
            return null;
          }

          const { classType, filters, instance, name } = classQuery.data.class;

          const where = createGqlFilters(JSON.parse(filters));

          const queryString = createGqlGet({
            className: name,
            classType,
            instance,
            properties: 'meta { count }',
            reference: 'CanvasClassNodeCounterQuery',
            type: 'Aggregate',
            where
          });

          return (
            <Query query={gql(queryString)}>
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

                let count;
                try {
                  count =
                    canvasClassNodeCounterQuery.data.Aggregate[classType][
                      name
                    ][0].meta.count;
                } catch (e) {
                  count = '';
                  // tslint:disable-next-line:no-console
                  console.log('could not extract count: ' + e);
                }

                return <Circle count={count} />;
              }}
            </Query>
          );
        }}
      </ClassQuery>
    );
  }
}

export default withStyles(styles)(CanvasClassNodeCounter);
