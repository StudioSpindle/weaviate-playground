import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
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
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import get from 'get-value';
import * as React from 'react';
import { Query } from 'react-apollo';
import { OntologyEditorClass, OntologyEditorProperty } from 'src/components';
import { ClassType } from 'src/types';
import { createApiHeaders } from '../../apis/ApiWeaviate';
import { CLASS_SCHEMA_QUERY } from '../library/queries';

/**
 * Types
 */
export interface IOntologyEditorProps extends WithStyles<typeof styles> {
  className?: string;
  classType?: ClassType;
}

export interface IOntologyEditorState {
  classId?: string;
  className?: string;
  classType?: ClassType;
  isDrawerOpen: boolean;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    button: {
      boxShadow: 'none',
      float: 'right'
    },
    buttonContainer: {
      display: 'flex'
    },
    buttonLabel: {
      color: theme.palette.common.white
    },
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

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');

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

  public componentWillMount() {
    const { className, classType } = this.props;
    if (className && classType) {
      this.setState({ className, classType });
    }
  }

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;
    const { className } = this.props;

    this.setState({
      classId: undefined,
      className,
      isDrawerOpen: !isDrawerOpen
    });
  };

  public setClassId = (
    classId: string,
    className: string,
    classType: ClassType
  ) => {
    this.setState({
      classId,
      className,
      classType
    });
  };

  public deleteProperty = (propertyName: string, refetch: any) => () => {
    const { className, classType } = this.props;
    const classTypeLowerCase = (classType || '').toLowerCase();
    fetch(
      `${url}/schema/${classTypeLowerCase}/${className}/properties/${propertyName}`,
      {
        headers: createApiHeaders(),
        method: 'DELETE'
      }
    )
      .then(res => {
        if (res.status < 400) {
          refetch();
        }
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public render() {
    const { classId, className, classType, isDrawerOpen } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        {this.props.className && this.props.classType ? (
          <IconButton
            aria-label="Edit thing or action"
            onClick={this.toggleDrawer}
          >
            <CreateIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            onClick={this.toggleDrawer}
            color="secondary"
            classes={{
              label: classes.buttonLabel,
              root: classes.button
            }}
          >
            <AddIcon />
            Create new Schema item
          </Button>
        )}

        <Drawer
          open={isDrawerOpen}
          onClose={this.toggleDrawer}
          classes={{ paper: classes.drawer }}
        >
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography component="h1" variant="subtitle1" color="inherit">
                {className || 'Untitled schema item'}
              </Typography>
              <div className={classes.grow} />
              <Button
                variant="contained"
                color="primary"
                onClick={this.toggleDrawer}
              >
                <Typography color="inherit" variant="body2">
                  Close
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>

          <div className={classes.paperContainer}>
            <Query query={CLASS_SCHEMA_QUERY} fetchPolicy="cache-and-network">
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
                    `data.classSchemas.${(
                      classType || ''
                    ).toLowerCase()}Schema.classes`
                  ) || [];

                const classSchema = classesSchema.find(
                  (schema: any) => schema.class === className
                );

                const description = get(classSchema, 'description');
                const keywords = get(classSchema, 'keywords') || [];
                const properties = get(classSchema, 'properties') || [];

                return (
                  <React.Fragment>
                    <Paper className={classes.paper}>
                      <div className={classes.paperBody}>
                        <Typography variant="h6">Class definition</Typography>
                      </div>
                      <Divider />
                      <div className={classes.paperBody}>
                        {className && classType && (
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
                        )}

                        {Boolean(keywords.length) && (
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
                        )}

                        <OntologyEditorClass
                          classId={classId}
                          className={className}
                          classType={classType}
                          classSchemaQuery={classSchemaQuery}
                          description={description}
                          keywords={keywords}
                          setClassId={this.setClassId}
                        />
                      </div>
                    </Paper>

                    <Paper className={classes.paper}>
                      <div className={classes.paperBody}>
                        <Typography variant="h6">Properties</Typography>
                      </div>
                      <Divider />

                      <Table>
                        <TableBody>
                          {properties.map((property: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{property.name}</TableCell>
                              <TableCell>{property.dataType[0]}</TableCell>
                              <TableCell>
                                <div className={classes.buttonContainer}>
                                  <OntologyEditorProperty
                                    className={className}
                                    classType={classType}
                                    classesSchema={classesSchema}
                                    classSchemaQuery={classSchemaQuery}
                                    property={property}
                                  />
                                  <IconButton
                                    aria-label="Edit thing or action"
                                    onClick={this.deleteProperty(
                                      property.name,
                                      classSchemaQuery.refetch
                                    )}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className={classes.paperBody}>
                        <OntologyEditorProperty
                          className={className}
                          classType={classType}
                          classesSchema={classesSchema}
                          classSchemaQuery={classSchemaQuery}
                        />
                      </div>
                    </Paper>
                  </React.Fragment>
                );
              }}
            </Query>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(OntologyEditor);
