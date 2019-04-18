import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
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
import DeleteIcon from '@material-ui/icons/Delete';
import get from 'get-value';
import * as React from 'react';
import { Mutation, QueryResult } from 'react-apollo';
import client from 'src/apollo/apolloClient';
import { ClassType, IKeyword, Keywords } from 'src/types';
import { camelize } from 'src/utils';
import { ClassId } from '../canvas/Canvas';
import { UPDATE_CLASS_MUTATION } from '../introspection/queries';
import { CLASS_IDS_QUERY } from '../libraryClasses/queries';
import { VALIDATE_WORDS_CONTEXTIONARY_QUERY } from './queries/ValidateClassName';

/**
 * Types
 */
export interface IOntologyEditorClassProps extends WithStyles<typeof styles> {
  classId?: ClassId;
  className?: string;
  classType?: ClassType;
  classSchemaQuery: QueryResult;
  description?: string;
  keywords?: Keywords;
  setClassId(classId: string, className: string, classType: string): void;
}

export interface IOntologyEditorClassState {
  className: string;
  classNameError: boolean;
  classType: ClassType;
  description: string;
  errors: Array<{ message: string }>;
  isAddKeywordDisabled: boolean;
  isDisabled: boolean;
  isDrawerOpen: boolean;
  keyword: IKeyword['keyword'];
  keywordError: boolean;
  weight: IKeyword['weight'];
  weightError: boolean;
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

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');
const inputProps = {
  InputLabelProps: { shrink: true }
};

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
      errors: [],
      isAddKeywordDisabled: false,
      isDisabled: false,
      isDrawerOpen: false,
      keyword: '',
      keywordError: false,
      keywords: [],
      weight: 1,
      weightError: false
    };
  }

  public componentWillMount() {
    const { className, classType, description, keywords } = this.props;
    if (className && classType) {
      this.setState({
        className,
        classType,
        description: description || '',
        keywords: keywords || []
      });
    }
  }

  public componentWillUpdate(nextProps: IOntologyEditorClassProps) {
    const { keywords } = this.state;
    if (
      this.props.keywords !== nextProps.keywords &&
      nextProps.keywords !== keywords &&
      nextProps.keywords
    ) {
      this.setState({
        description: nextProps.description || '',
        keywords: nextProps.keywords
      });
    }
  }

  public setFormField = (name: string) => (event: any) => {
    // @ts-ignore
    this.setState({ [name]: event.target.value });
  };

  public validateFormField = (name: string) => (event: any) => {
    const isClassName = name === 'className';
    const isKeyword = name === 'keyword';
    const isWeight = name === 'weight';

    if (isWeight) {
      if (this.state.weight >= 0 && this.state.weight <= 1) {
        this.setState({ isAddKeywordDisabled: false, weightError: false });
      } else {
        this.setState({ isAddKeywordDisabled: true, weightError: true });
      }
    }

    if (isClassName || isKeyword) {
      if (this.state[name] === '') {
        if (isClassName) {
          this.setState({
            classNameError: false,
            isDisabled: false
          });
        } else if (isKeyword) {
          this.setState({
            isDisabled: false,
            keywordError: false
          });
        }
      } else {
        client
          .query({
            query: VALIDATE_WORDS_CONTEXTIONARY_QUERY,
            variables: {
              words: camelize(this.state[name])
            }
          })
          .then((result: any) => {
            const individualWords = get(
              result,
              'data.validateWordsContextionary.individualWords'
            );
            const notInC11y = individualWords.some((word: any) => !word.inC11y);

            if (notInC11y) {
              if (isClassName) {
                this.setState({ isDisabled: true, classNameError: true });
              } else if (isKeyword) {
                this.setState({
                  isAddKeywordDisabled: true,
                  keywordError: true
                });
              }
            } else {
              if (isClassName) {
                this.setState({ isDisabled: false, classNameError: false });
              } else if (isKeyword) {
                this.setState({
                  isAddKeywordDisabled: false,
                  keywordError: false
                });
              }
            }
          })
          .catch(error => {
            this.setState({ isDisabled: true, classNameError: true });
          });
      }
    }
  };

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;
    const { classSchemaQuery } = this.props;

    if (isDrawerOpen) {
      classSchemaQuery.refetch();
    } else {
      this.setState({
        isDrawerOpen: !isDrawerOpen
      });
    }
  };

  public addKeyword = () => {
    const { keyword, keywords, weight } = this.state;

    if (keyword) {
      this.setState({
        keyword: '',
        keywords: [...keywords, { keyword, weight: Number(weight) }],
        weight: 1
      });
    }
  };

  public deleteKeyword = (keyword: string) => () => {
    const { keywords } = this.state;
    const newKeywords = keywords.filter(
      keywordObj => keywordObj.keyword !== keyword
    );
    this.setState({
      keywords: newKeywords
    });
  };

  public saveClassMutation = (saveClassMutation: any) => {
    const { className, classType, description, keywords } = this.state;
    const { setClassId } = this.props;
    const classId = `local-${classType}-${className}`;
    const isNewClass = !this.props.className;

    fetch(
      `${url}schema/${
        this.props.classType
          ? this.props.classType.toLowerCase()
          : classType.toLowerCase()
      }/${isNewClass ? '' : this.props.className}`,
      {
        body: JSON.stringify({
          class: className,
          description,
          keywords
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: isNewClass ? 'POST' : 'PUT'
      }
    )
      .then(res => res.text())
      .then(text => (text.length ? JSON.parse(text) : {}))
      .then(res => {
        if (res.error) {
          // @ts-ignore
          this.setState({ errors: res.error });
          throw new Error('');
        } else {
          return;
        }
      })

      .then(() => {
        return saveClassMutation();
      })
      .then(() => {
        return client.query({
          query: CLASS_IDS_QUERY
        });
      })
      .then(res => {
        return setClassId(classId, className, classType);
      })
      .then(() => {
        this.toggleDrawer();
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
      errors,
      isAddKeywordDisabled,
      isDisabled,
      isDrawerOpen,
      keyword,
      keywordError,
      keywords,
      weight,
      weightError
    } = this.state;
    const { classes } = this.props;
    const isNewClass = !this.props.className;

    return (
      <div className={classes.ontologyActionsContainer}>
        <Button variant="outlined" onClick={this.toggleDrawer}>
          <Typography>{className ? 'Edit' : 'Configure class'}</Typography>
        </Button>

        <Drawer open={isDrawerOpen} classes={{ paper: classes.drawer }}>
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography component="h1" variant="subtitle1" color="inherit">
                {isNewClass ? 'New' : 'Edit'} class
              </Typography>
            </Toolbar>
          </AppBar>
          <form className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    {...inputProps}
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
                    {...inputProps}
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
                    {...inputProps}
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
                    {...inputProps}
                    id="keyword"
                    name="keyword"
                    label="Keyword"
                    helperText="Helper text"
                    value={keyword}
                    onChange={this.setFormField('keyword')}
                    onBlur={this.validateFormField('keyword')}
                    error={keywordError}
                    fullWidth={true}
                    autoComplete="ontologyEditorClass keyword"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={4}>
                  <TextField
                    {...inputProps}
                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                    type="number"
                    id="weight"
                    name="weight"
                    label="Weight"
                    helperText="Helper text"
                    value={weight}
                    onChange={this.setFormField('weight')}
                    onBlur={this.validateFormField('weight')}
                    error={weightError}
                    fullWidth={true}
                    autoComplete="ontologyEditorClass weight"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={2}>
                  <Button
                    variant="text"
                    disabled={isAddKeywordDisabled}
                    onClick={this.addKeyword}
                  >
                    Add
                  </Button>
                </Grid>
                <Grid item={true} xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Keyword</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {keywords.map((keywordItem, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{keywordItem.keyword}</TableCell>
                          <TableCell>{keywordItem.weight}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="Edit thing or action"
                              onClick={this.deleteKeyword(keywordItem.keyword)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
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
                <Mutation
                  mutation={UPDATE_CLASS_MUTATION}
                  variables={{
                    classLocation: 'Local',
                    classType,
                    filters: '{}',
                    id: `local-${classType}-${className}`,
                    instance: 'Local',
                    name: className
                  }}
                >
                  {saveClassMutation => {
                    return (
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
                        Save class
                      </Button>
                    );
                  }}
                </Mutation>
                {errors.length
                  ? errors.map((error, i) => (
                      <Typography key={i} color="error">
                        {error.message}
                      </Typography>
                    ))
                  : ''}
              </div>
            </Paper>
          </form>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditorClass);
