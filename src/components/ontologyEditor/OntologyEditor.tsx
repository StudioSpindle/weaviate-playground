import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import get from 'get-value';
import * as React from 'react';
import { Query } from 'react-apollo';
import { OntologyEditorClass, OntologyEditorProperty } from 'src/components';
import { CLASS_SCHEMA_QUERY } from '../library/queries';
import {
  ONTOLOGY_EDITOR_CLASS_NAME_QUERY,
  OntologyEditorClassNameQuery
} from './queries';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IOntologyEditorProps extends WithStyles<typeof styles> {}

export interface IOntologyEditorState {
  classId?: string;
  className?: string;
  classType?: string;
  isDrawerOpen: boolean;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    drawer: {
      backgroundColor: theme.palette.grey[100],
      minWidth: '600px'
    },
    grow: {
      flexGrow: 1
    },
    ontologyActionsContainer: {
      padding: '0.25em'
    },
    paper: {
      margin: '1em'
    },
    paperBody: {
      padding: '1em'
    },
    paperContainer: {
      padding: '1em'
    }
  });

/**
 * Component
 */
class OntologyEditor extends React.Component<
  IOntologyEditorProps,
  IOntologyEditorState
> {
  constructor(props: IOntologyEditorProps) {
    super(props);
    this.state = {
      classId: undefined,
      isDrawerOpen: false
    };
  }

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;

    this.setState({
      isDrawerOpen: !isDrawerOpen
    });
  };

  public setClassId = (
    classId: string,
    className: string,
    classType: string
  ) => {
    this.setState({
      classId,
      className,
      classType
    });
  };

  public render() {
    const { classId, className, classType, isDrawerOpen } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.ontologyActionsContainer}>
        <Button variant="outlined" onClick={this.toggleDrawer}>
          <Typography>Create schema item</Typography>
        </Button>

        <Drawer
          open={isDrawerOpen}
          onClose={this.toggleDrawer}
          classes={{ paper: classes.drawer }}
        >
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              {classId ? (
                <OntologyEditorClassNameQuery
                  query={ONTOLOGY_EDITOR_CLASS_NAME_QUERY}
                  variables={{ id: classId }}
                >
                  {classNameQuery => {
                    if (
                      classNameQuery.loading ||
                      classNameQuery.error ||
                      !classNameQuery.data
                    ) {
                      return null;
                    }

                    return (
                      <Typography color="inherit">
                        {classNameQuery.data.class.name}
                      </Typography>
                    );
                  }}
                </OntologyEditorClassNameQuery>
              ) : (
                <Typography color="inherit">Untitled schema item</Typography>
              )}
              <div className={classes.grow} />
              <Button
                variant="contained"
                color="primary"
                onClick={this.toggleDrawer}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>

          <div className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <div className={classes.paperBody}>
                <Typography variant="h6">Class definition</Typography>
              </div>
              <Divider />
              <div className={classes.paperBody}>
                {className && classType && (
                  <Query
                    query={CLASS_SCHEMA_QUERY}
                    fetchPolicy="cache-and-network"
                  >
                    {classSchemaQuery => {
                      if (
                        classSchemaQuery.loading ||
                        classSchemaQuery.error ||
                        !classSchemaQuery.data
                      ) {
                        return null;
                      }

                      const classesSchema =
                        get(
                          classSchemaQuery,
                          `data.classSchemas.${classType.toLowerCase()}Schema.classes`
                        ) || [];

                      const classSchema = classesSchema.find(
                        (schema: any) => schema.class === className
                      );

                      const description = get(classSchema, 'description');
                      const keywords = get(classSchema, 'keywords') || [];

                      // tslint:disable-next-line:no-console
                      console.log(classSchema, keywords);

                      return (
                        <React.Fragment>
                          <Typography variant="h6">Class definition</Typography>

                          <Grid container={true} spacing={8}>
                            <Grid item={true} xs={12}>
                              <Typography color="textSecondary">
                                Schema type
                              </Typography>
                              <Typography>{classType}</Typography>
                            </Grid>
                            <Grid item={true} xs={12}>
                              <Typography color="textSecondary">
                                Class name
                              </Typography>
                              <Typography>{className}</Typography>
                            </Grid>
                            <Grid item={true} xs={12}>
                              <Typography color="textSecondary">
                                Description
                              </Typography>
                              <Typography>
                                {description || 'Undefined'}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Keyword</TableCell>
                                <TableCell>Weight</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {keywords.map((keyword: any, i: number) => (
                                <TableRow key={i}>
                                  <TableCell>{keyword.keyword}</TableCell>
                                  <TableCell>{keyword.weight}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </React.Fragment>
                      );
                    }}
                  </Query>
                )}
                <OntologyEditorClass
                  classId={classId}
                  setClassId={this.setClassId}
                />
              </div>
            </Paper>
            <Paper className={classes.paper}>
              <div className={classes.paperBody}>
                <Typography variant="h6">Properties</Typography>
              </div>
              <Divider />
              <div className={classes.paperBody}>
                <OntologyEditorProperty
                  className={className}
                  classType={classType}
                />
              </div>
            </Paper>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditor);
