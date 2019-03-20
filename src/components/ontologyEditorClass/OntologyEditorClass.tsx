import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
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
import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import client from 'src/apollo/apolloClient';
import { ClassId } from '../canvas/Canvas';
import { UPDATE_CLASS_MUTATION } from '../introspection/queries';

/**
 * Types
 */
export interface IOntologyEditorClassProps extends WithStyles<typeof styles> {
  classId?: ClassId;
  setClassId(classId: string, className: string, classType: string): void;
}

export interface IOntologyEditorClassState {
  className: string;
  classNameError: boolean;
  classType: 'actions' | 'things';
  description: string;
  isDisabled: boolean;
  isDrawerOpen: boolean;
  keywords: string[];
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    button: {
      margin: '0.25em'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    drawer: {
      backgroundColor: theme.palette.grey[100],
      maxWidth: '500px'
    },
    grow: {
      flexGrow: 1
    },
    ontologyActionsContainer: {
      padding: '0.25em'
    },
    paper: {
      margin: '1em',
      padding: '1em'
    },
    paperContainer: {
      padding: '1em'
    }
  });

/**
 * Component
 */
class OntologyEditorClass extends React.Component<
  IOntologyEditorClassProps,
  IOntologyEditorClassState
> {
  constructor(props: IOntologyEditorClassProps) {
    super(props);
    this.state = {
      className: '',
      classNameError: false,
      classType: 'things',
      description: '',
      isDisabled: true,
      isDrawerOpen: false,
      keywords: []
    };
  }

  public setFormField = (name: string) => (event: any) => {
    // @ts-ignore
    this.setState({ [name]: event.target.value });
  };

  public validateFormField = (name: string) => (event: any) => {
    const { className } = this.state;
    if (name === 'className') {
      if (className === '') {
        this.setState({
          classNameError: true,
          isDisabled: true
        });
      } else {
        this.setState({ isDisabled: false, classNameError: false });
      }
    }
  };

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;

    this.setState({
      isDrawerOpen: !isDrawerOpen
    });
  };

  public saveClassMutation = (saveClassMutation: any) => {
    const { className, classType, description, keywords } = this.state;
    const { setClassId } = this.props;

    const classTypeCapitalized =
      classType.charAt(0).toUpperCase() + classType.slice(1);
    const classId = `local-${classTypeCapitalized}-${className}`;

    saveClassMutation({
      variables: {
        body: {
          class: className,
          description,
          keywords
        },
        classType
      }
    })
      .then(() => {
        return client.mutate({
          mutation: UPDATE_CLASS_MUTATION,
          variables: {
            classLocation: 'Local',
            classType,
            filters: '{}',
            id: classId,
            instance: 'Local',
            name: className
          }
        });
      })
      .then(() => {
        return setClassId(classId, className, classType);
      })
      .then(() => {
        this.setState({ isDrawerOpen: false });
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public render() {
    const {
      className,
      classNameError,
      classType,
      description,
      isDisabled,
      isDrawerOpen,
      keywords
    } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.ontologyActionsContainer}>
        <Button variant="outlined" onClick={this.toggleDrawer}>
          <Typography>{className ? 'Edit' : 'Configure class'}</Typography>
        </Button>

        <Drawer
          open={isDrawerOpen}
          onClose={this.toggleDrawer}
          classes={{ paper: classes.drawer }}
        >
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography color="inherit">New class</Typography>
            </Toolbar>
          </AppBar>
          <form className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Class definition</Typography>

              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    id="class-type"
                    select={true}
                    label="Select"
                    fullWidth={true}
                    value={classType}
                    onChange={this.setFormField('classType')}
                    helperText="Helper text"
                    margin="normal"
                  >
                    <MenuItem value="things">Thing</MenuItem>
                    <MenuItem value="actions">Action</MenuItem>
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    required={true}
                    id="className"
                    name="className"
                    label="Class name"
                    helperText="Helper text"
                    value={className}
                    onChange={this.setFormField('className')}
                    fullWidth={true}
                    autoComplete="ontologyEditorClass className"
                    onBlur={this.validateFormField('className')}
                    error={classNameError}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    helperText="Helper text"
                    value={description}
                    onChange={this.setFormField('description')}
                    fullWidth={true}
                    autoComplete="ontologyEditorClass description"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={6}>
                  <TextField
                    id="keywords"
                    name="keywords"
                    label="Keywords"
                    helperText="Helper text"
                    value={keywords}
                    onChange={this.setFormField('keywords')}
                    fullWidth={true}
                    autoComplete="ontologyEditorClass keywords"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={4}>
                  <TextField
                    id="weight"
                    name="weight"
                    label="Weight"
                    helperText="Helper text"
                    fullWidth={true}
                    autoComplete="ontologyEditorClass weight"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={2}>
                  <Button variant="text" onClick={this.toggleDrawer}>
                    <Typography>Add</Typography>
                  </Button>
                </Grid>
              </Grid>

              <div className={classes.buttonContainer}>
                <Button
                  variant="text"
                  size="small"
                  onClick={this.toggleDrawer}
                  className={classes.button}
                >
                  Cancel
                </Button>
                <Mutation
                  mutation={gql`
                    mutation createClass($classType: String!, $body: Body!) {
                      saveClass(classType: $classType, body: $body)
                        @rest(
                          type: "Class"
                          path: "schema/{args.classType}"
                          method: "POST"
                          bodyKey: "body"
                        ) {
                        NoResponse
                      }
                    }
                  `}
                >
                  {(saveClassMutation, result) => (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      disabled={isDisabled}
                      onClick={this.saveClassMutation.bind(
                        null,
                        saveClassMutation
                      )}
                      className={classes.button}
                    >
                      {result.loading
                        ? 'Submitting...'
                        : result.error
                        ? 'Error'
                        : 'Save class'}
                    </Button>
                  )}
                </Mutation>
              </div>
            </Paper>
          </form>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditorClass);
