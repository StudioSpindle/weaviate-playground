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
import AddIcon from '@material-ui/icons/Add';
import get from 'get-value';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ClassType } from 'src/types';
import { CLASS_SCHEMA_QUERY } from '../library/queries';
import { CLASS_IDS_QUERY, ClassIdsQuery } from '../libraryClasses/queries';

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');

/**
 * Types
 */
export interface INodeEditorProps extends WithStyles<typeof styles> {
  className?: string;
  classType?: ClassType;
}

export interface INodeEditorState {
  classId?: string;
  className?: string;
  classType?: ClassType;
  isDrawerOpen: boolean;
  form: {};
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
class NodeEditor extends React.Component<INodeEditorProps, INodeEditorState> {
  constructor(props: INodeEditorProps) {
    super(props);
    this.state = {
      classId: undefined,
      form: {},
      isDrawerOpen: false
    };
  }

  public componentWillMount() {
    const { className, classType } = this.props;
    if (className && classType) {
      this.setState({ className, classType });
    }
  }

  public renderPropertyField = (property: any) => {
    const dataType = property['@dataType'][0];

    const props: StandardTextFieldProps = {
      fullWidth: true,
      helperText: 'Helper text',
      id: property.name,
      label: property.name,
      margin: 'normal',
      onChange: this.setFormField(property.name, dataType)
    };

    switch (dataType) {
      case 'string':
        return <TextField {...props} />;

      case 'text':
        return <TextField type="text" {...props} />;

      case 'int':
        return <TextField type="number" {...props} />;

      case 'number':
        return <TextField type="number" {...props} />;

      case 'date':
        return <TextField type="date" {...props} />;

      case 'boolean':
        return (
          <Grid container={true} spacing={24} alignItems="center">
            <Grid item={true}>
              <Switch onChange={this.setFormField(property.name, dataType)} />
            </Grid>
            {property.name && (
              <Grid item={true}>
                <Typography>{property.name}</Typography>
              </Grid>
            )}
          </Grid>
        );

      case 'geoCoordinates':
        return (
          <React.Fragment>
            <Grid>
              <Typography>{property.name}</Typography>
            </Grid>
            <Grid container={true} spacing={24} alignItems="center">
              <Grid item={true}>
                <TextField
                  type="number"
                  {...props}
                  label="Longitude"
                  onChange={this.setFormField(
                    property.name,
                    dataType,
                    'longitude'
                  )}
                />
              </Grid>
              <Grid item={true}>
                <TextField
                  type="number"
                  {...props}
                  label="Latitude"
                  onChange={this.setFormField(
                    property.name,
                    dataType,
                    'latitude'
                  )}
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
                return <TextField {...props} />;
              }
              return <Typography>An error occurred</Typography>;
            }}
          </ClassIdsQuery>
        );
    }
  };

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;
    const { className } = this.props;

    this.setState({
      classId: undefined,
      className,
      isDrawerOpen: !isDrawerOpen
    });
  };

  public setFormField = (name: string, type: string, subName?: string) => (
    event: any,
    checked?: boolean
  ) => {
    const { form } = this.state;
    let value = event.target.value;
    if (type === 'string') {
      value = event.target.value;
    } else if (type === 'int' || type === 'number') {
      value = Number(value);
    } else if (type === 'date') {
      value = new Date(value).toISOString();
    } else if (type === 'boolean') {
      value = checked;
    } else if (type === 'geoCoordinates') {
      value = {
        ...this.state.form[name],
        [subName || '']: Number(event.target.value)
      };
    } else {
      value = {
        $cref: event.target.value
      };
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
    const { className, classType } = this.props;
    const classTypeSingularLowercase = (classType || '')
      .toLowerCase()
      .slice(0, -1);

    fetch(`${url}${(classType || '').toLowerCase()}`, {
      body: JSON.stringify({
        [`${classTypeSingularLowercase}`]: {
          '@class': className,
          '@context': 'string',
          schema: form
        },
        async: true
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(res => {
        if (res.status >= 400) {
          // this.setState({ isDisabled: true, keywordError: true });
          throw new Error('');
        } else {
          return res.text();
        }
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
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

  public render() {
    const { className, classType, isDrawerOpen } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        {this.props.className && this.props.classType && (
          <IconButton
            aria-label="Edit thing or action"
            onClick={this.toggleDrawer}
          >
            <AddIcon />
          </IconButton>
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
                        >
                          Save {className}
                        </Button>
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
