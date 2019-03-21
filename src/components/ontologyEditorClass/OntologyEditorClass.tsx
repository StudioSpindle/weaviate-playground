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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import client from 'src/apollo/apolloClient';
import { ClassType, IKeyword, Keywords } from 'src/types';
import { ClassId } from '../canvas/Canvas';
import { UPDATE_CLASS_MUTATION } from '../introspection/queries';
import {
  CREATE_CLASS_MUTATION,
  CreateClassMutation,
  UPDATE_CLASS_SCHEMA_MUTATION,
  UpdateClassSchemaMutation
} from './queries';

/**
 * Types
 */
export interface IOntologyEditorClassProps extends WithStyles<typeof styles> {
  classId?: ClassId;
  className?: string;
  classType?: ClassType;
  keywords?: Keywords;
  setClassId(classId: string, className: string, classType: string): void;
}

export interface IOntologyEditorClassState {
  className: string;
  classNameError: boolean;
  classType: ClassType;
  description: string;
  isDisabled: boolean;
  isDrawerOpen: boolean;
  keyword: IKeyword['keyword'];
  weight: IKeyword['weight'];
  keywords: Keywords;
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
      classType: 'Things',
      description: '',
      isDisabled: true,
      isDrawerOpen: false,
      keyword: '',
      keywords: [],
      weight: 0
    };
  }

  public componentWillMount() {
    const { className, classType } = this.props;
    if (className && classType) {
      this.setState({ className, classType });
    }
  }

  public componentWillUpdate(nextProps: IOntologyEditorClassProps) {
    const { keywords } = this.state;
    if (nextProps.keywords !== keywords && nextProps.keywords) {
      this.setState({ keywords: nextProps.keywords });
    }
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
    const classId = `local-${classType}-${className}`;

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

  public updateClassSchemaMutation = (updateClassSchemaMutation: any) => {
    const { className, classType, keyword, keywords, weight } = this.state;
    const newKeywords = [...keywords, { keyword, weight: Number(weight) }];

    updateClassSchemaMutation({
      variables: {
        body: {
          keywords: newKeywords
        },
        className,
        classType: classType.toLowerCase()
      }
    })
      .then(() => {
        this.setState({ keyword: '', keywords: newKeywords, weight: 0 });
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
      keyword,
      keywords,
      weight
    } = this.state;
    const { classes } = this.props;
    const isNewClass = !this.props.className;

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
              <Typography color="inherit">
                {isNewClass ? 'New' : 'Edit'} class
              </Typography>
            </Toolbar>
          </AppBar>
          <form className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    disabled={!isNewClass}
                    id="class-type"
                    select={true}
                    label="Select"
                    fullWidth={true}
                    value={classType}
                    onChange={this.setFormField('classType')}
                    helperText="Helper text"
                    margin="normal"
                  >
                    <MenuItem value="Things">Thing</MenuItem>
                    <MenuItem value="Actions">Action</MenuItem>
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    disabled={!isNewClass}
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
                    disabled={!isNewClass}
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
                    id="keyword"
                    name="keyword"
                    label="Keyword"
                    helperText="Helper text"
                    value={keyword}
                    onChange={this.setFormField('keyword')}
                    fullWidth={true}
                    autoComplete="ontologyEditorClass keyword"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={4}>
                  <TextField
                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                    type="number"
                    id="weight"
                    name="weight"
                    label="Weight"
                    helperText="Helper text"
                    value={weight}
                    onChange={this.setFormField('weight')}
                    fullWidth={true}
                    autoComplete="ontologyEditorClass weight"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={2}>
                  <UpdateClassSchemaMutation
                    mutation={UPDATE_CLASS_SCHEMA_MUTATION}
                  >
                    {(updateClassSchemaMutation, result) => (
                      <Button
                        variant="text"
                        onClick={this.updateClassSchemaMutation.bind(
                          null,
                          updateClassSchemaMutation
                        )}
                      >
                        Add
                      </Button>
                    )}
                  </UpdateClassSchemaMutation>
                </Grid>
                <Grid item={true} xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Keyword</TableCell>
                        <TableCell>Weight</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {keywords.map((keywordItem, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{keywordItem.keyword}</TableCell>
                          <TableCell>{keywordItem.weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                <CreateClassMutation mutation={CREATE_CLASS_MUTATION}>
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
                </CreateClassMutation>
              </div>
            </Paper>
          </form>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditorClass);
