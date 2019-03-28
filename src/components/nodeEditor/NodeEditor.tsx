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
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import get from 'get-value';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ClassType } from 'src/types';
import { CLASS_SCHEMA_QUERY } from '../library/queries';

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
                                <TextField
                                  id={property.name}
                                  label={property.name}
                                  fullWidth={true}
                                  helperText="Helper text"
                                  margin="normal"
                                />
                              </Grid>
                            );
                          })}
                        </Grid>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          className={classes.button}
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
