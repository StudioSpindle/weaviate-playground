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
import Switch from '@material-ui/core/Switch';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import get from 'get-value';
import * as React from 'react';
import { Query } from 'react-apollo';
import apolloClient from 'src/apollo/apolloClient';
import { ClassType } from 'src/types';
import { CLASS_SCHEMA_QUERY } from '../library/queries';
import { CLASS_IDS_QUERY, ClassIdsQuery } from '../libraryClasses/queries';
import { UPDATE_META_COUNT_MUTATION } from './queries';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');

/**
 * Types
 */
export interface INodeEditorProps extends WithStyles<typeof styles> {
  className: string;
  classType: ClassType;
  nodeId?: string;
  refetch(): void;
}

export interface INodeEditorState {
  errors: Array<{ message: string }>;
  isDrawerOpen: boolean;
  form: {};
  formErrors: {};
  temp: {};
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    button: {
      margin: '0.5em 0.9em'
    },
    drawer: {
      backgroundColor: theme.palette.grey[100],
      width: '600px'
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
class NodeEditor extends React.Component<INodeEditorProps, INodeEditorState> {
  constructor(props: INodeEditorProps) {
    super(props);
    this.state = {
      errors: [],
      form: {},
      formErrors: {},
      isDrawerOpen: false,
      temp: {}
    };
  }

  public componentDidMount() {
    const { classType, nodeId } = this.props;
    if (nodeId) {
      fetch(`${url}${(classType || '').toLowerCase()}/${nodeId}`)
        .then(res => res.json())
        .then(res => {
          this.setState({ form: res.schema });
        })
        // tslint:disable-next-line:no-console
        .catch(console.log);
    }
  }

  public renderPropertyField = (property: any) => {
    const { form, formErrors, temp } = this.state;
    const dataType = property.dataType[0];
    const field = form[property.name];
    const fieldError = formErrors[property.name];

    const props: StandardTextFieldProps = {
      InputLabelProps: { shrink: true },
      fullWidth: true,
      helperText: 'Helper text',
      id: property.name,
      label: property.name,
      margin: 'normal',
      onChange: this.setFormField(property.name, dataType)
    };

    switch (dataType) {
      case 'string':
        return <TextField {...props} value={field} />;

      case 'text':
        return <TextField type="text" {...props} value={field} />;

      case 'int':
      case 'number':
        return <TextField type="number" {...props} value={field} />;

      case 'date':
        const newField = (field || '').replace('Z', '');
        return <TextField type="datetime-local" {...props} value={newField} />;

      case 'boolean':
        return (
          <Grid container={true} spacing={24} alignItems="center">
            <Grid item={true}>
              <Switch
                onChange={this.setFormField(property.name, dataType)}
                checked={field}
              />
            </Grid>
            {property.name && (
              <Grid item={true}>
                <Typography>{property.name}</Typography>
              </Grid>
            )}
          </Grid>
        );

      case 'geoCoordinates':
        const longitudeError = fieldError && fieldError.longitude;
        const latitudeError = fieldError && fieldError.latitude;

        return (
          <React.Fragment>
            <Grid>
              <Typography>{property.name}</Typography>
            </Grid>
            <Grid container={true} spacing={24} alignItems="center">
              <Grid item={true}>
                <TextField
                  {...props}
                  type="number"
                  label="Longitude"
                  helperText={longitudeError || 'Helper text'}
                  inputProps={{ min: -180, max: 180, step: 0.000001 }}
                  onChange={this.setFormField(
                    property.name,
                    dataType,
                    'longitude'
                  )}
                  value={field && field.longitude}
                  error={longitudeError}
                />
              </Grid>
              <Grid item={true}>
                <TextField
                  {...props}
                  type="number"
                  inputProps={{ min: -90, max: 90, step: 0.000001 }}
                  label="Latitude"
                  helperText={latitudeError || 'Helper text'}
                  onChange={this.setFormField(
                    property.name,
                    dataType,
                    'latitude'
                  )}
                  value={field && field.latitude}
                  error={latitudeError}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        );

      default:
        return (
          <ClassIdsQuery query={CLASS_IDS_QUERY}>
            {classIdsQuery => {
              const classIds: string[] = get(
                classIdsQuery,
                'data.canvas.classIds'
              );
              const filteredClassIds = classIds.filter(classId =>
                classId.includes(dataType)
              );
              if (filteredClassIds.length) {
                if (property.cardinality === 'many') {
                  return (
                    <Grid container={true}>
                      <Grid item={true} xs={12} sm={9}>
                        <TextField
                          {...props}
                          onChange={this.setTemporaryFormField(property.name)}
                          value={temp[property.name]}
                          error={fieldError}
                          helperText={fieldError || 'Helper text'}
                        />
                      </Grid>
                      <Grid item={true} xs={12} sm={3}>
                        <Button
                          onClick={this.setFormField(
                            property.name,
                            dataType,
                            undefined,
                            true
                          )}
                        >
                          Add
                        </Button>
                      </Grid>
                      {field && field.length
                        ? field.map((cref: { $cref: string }, i: number) => (
                            <Grid item={true} xs={12}>
                              <Typography key={i}>{cref.$cref}</Typography>
                            </Grid>
                          ))
                        : ''}
                    </Grid>
                  );
                }

                return (
                  <TextField
                    {...props}
                    value={field && field.$cref}
                    error={fieldError}
                    helperText={fieldError || 'Helper text'}
                  />
                );
              }
              return <Typography>An error occurred</Typography>;
            }}
          </ClassIdsQuery>
        );
    }
  };

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;

    this.setState({
      isDrawerOpen: !isDrawerOpen
    });
  };

  public setTemporaryFormField = (name: string) => (event: any) => {
    const { formErrors, temp } = this.state;
    const value = event.target.value;
    const newTemp = {
      ...temp,
      [name]: value
    };

    if (
      value &&
      value !== '' &&
      ((value && !value.includes('weaviate://')) ||
        (!value.includes('/things/') && !value.includes('/actions/')))
    ) {
      this.setState({
        formErrors: {
          ...formErrors,
          [name]: 'Invalid cref'
        },
        temp: newTemp
      });
    } else {
      this.setState({
        formErrors: {
          ...formErrors,
          [name]: undefined
        },
        temp: newTemp
      });
    }
  };

  public setFormField = (
    name: string,
    type: string,
    subName?: string,
    hasMany?: boolean
  ) => (event: any, checked?: boolean) => {
    const { formErrors, form, temp } = this.state;
    let value = event.target.value || form[name];
    if (type === 'string' || type === 'text') {
      value = event.target.value;
    } else if (type === 'int' || type === 'number') {
      value = Number(value);
    } else if (type === 'date') {
      value = new Date(value).toISOString();
    } else if (type === 'boolean') {
      value = checked;
    } else if (type === 'geoCoordinates') {
      if (subName === 'latitude') {
        if (value < -90 || value > 90) {
          this.setState({
            formErrors: {
              ...formErrors,
              [name]: {
                ...formErrors[name],
                latitude: 'Out of range'
              }
            }
          });
        } else {
          this.setState({
            formErrors: {
              ...formErrors,
              [name]: {
                ...formErrors[name],
                latitude: undefined
              }
            }
          });
        }
      }

      if (subName === 'longitude') {
        if (value < -180 || value > 180) {
          this.setState({
            formErrors: {
              ...formErrors,
              [name]: {
                ...formErrors[name],
                longitude: 'Out of range'
              }
            }
          });
        } else {
          this.setState({
            formErrors: {
              ...formErrors,
              [name]: {
                ...formErrors[name],
                longitude: undefined
              }
            }
          });
        }
      }

      value = {
        ...this.state.form[name],
        [subName || '']: Number(event.target.value)
      };
    } else {
      const cref = {
        $cref: event.target.value || temp[name]
      };
      if (hasMany) {
        value = [...(value || []), cref];
        this.setState({
          temp: {
            ...temp,
            [name]: ''
          }
        });
      } else {
        if (cref.$cref) {
          value = cref;

          if (
            (cref.$cref !== '' && !cref.$cref.includes('weaviate://')) ||
            (!cref.$cref.includes('/things/') &&
              !cref.$cref.includes('/actions/'))
          ) {
            this.setState({
              formErrors: {
                ...formErrors,
                [name]: 'Invalid cref'
              }
            });
          } else {
            this.setState({
              formErrors: {
                ...formErrors,
                [name]: undefined
              }
            });
          }
        } else {
          value = undefined;
          this.setState({
            formErrors: {
              ...formErrors,
              [name]: undefined
            }
          });
        }
      }
    }

    this.setState({
      form: {
        ...form,
        [name]: value
      }
    });
  };

  public saveNode = () => {
    const { form } = this.state;
    const { className, classType, nodeId, refetch } = this.props;
    const body = {
      class: className,
      schema: form
    };

    fetch(
      `${url}${(classType || '').toLowerCase()}${nodeId ? `/${nodeId}` : ''}`,
      {
        body: JSON.stringify(body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: nodeId ? 'PUT' : 'POST'
      }
    )
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          // @ts-ignore
          this.setState({ errors: res.error });
          throw new Error('');
        } else {
          if (!nodeId) {
            // Update the count until GraphQL subscriptions are added
            apolloClient.mutate({
              mutation: UPDATE_META_COUNT_MUTATION,
              variables: { className, addition: true }
            });
          }
          // Reset the form and close the drawer to avoid double form submissions
          refetch();
          const newState = {
            errors: [],
            isDrawerOpen: false
          };
          if (nodeId) {
            this.setState(newState);
          } else {
            this.setState({ ...newState, form: {}, temp: {} });
          }
        }
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public render() {
    const { errors, formErrors, isDrawerOpen } = this.state;
    const { classes, className, classType } = this.props;
    const isDisabled = Object.keys(formErrors).some(key => {
      if (typeof formErrors[key] === 'object') {
        return Object.keys(formErrors[key]).some(
          childKey => formErrors[key][childKey]
        );
      }

      return formErrors[key];
    });

    return (
      <React.Fragment>
        {this.props.nodeId ? (
          <IconButton
            aria-label="Edit thing or action"
            onClick={this.toggleDrawer}
          >
            <CreateIcon />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            aria-label="Add thing or action"
            onClick={this.toggleDrawer}
          >
            <Typography>Add data instance</Typography>
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

                const properties = get(classSchema, 'properties') || [];

                return (
                  <React.Fragment>
                    <Paper className={classes.paper}>
                      <div className={classes.paperBody}>
                        <Typography variant="h6">Add {className}</Typography>
                      </div>
                      <Divider />
                      <div className={classes.paperBody}>
                        <Grid container={true} spacing={8}>
                          {properties.map((property: any, i: number) => {
                            return (
                              <Grid key={i} item={true} xs={12}>
                                {this.renderPropertyField(property)}
                              </Grid>
                            );
                          })}
                        </Grid>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          className={classes.button}
                          onClick={this.saveNode}
                          disabled={isDisabled}
                        >
                          Save {className}
                        </Button>
                        {errors.length
                          ? errors.map((error, i) => (
                              <Typography key={i} color="error">
                                {error.message}
                              </Typography>
                            ))
                          : ''}
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

export default withStyles(styles)(NodeEditor);
