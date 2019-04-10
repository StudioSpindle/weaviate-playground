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
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import get from 'get-value';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import client from 'src/apollo/apolloClient';
import { Keywords } from 'src/types';
import { camelize } from 'src/utils';
import { VALIDATE_WORDS_CONTEXTIONARY_QUERY } from '../ontologyEditorClass/queries/ValidateClassName';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface ISchemaKeyword {
  weight: number;
}
export interface IOntologyEditorPropertyProps
  extends WithStyles<typeof styles> {
  classesSchema: any[];
  className?: string;
  classType?: string;
  classSchemaQuery: QueryResult;
  property?: {};
}

export interface IOntologyEditorPropertyState {
  errors: Array<{ message: string }>;
  form: {
    cardinality: 'atMostOne' | 'many';
    classReference?: string;
    ['@dataType']: [string];
    description: string;
    keywords: Keywords;
    name: string;
  };
  formErrors: {
    name: boolean;
    keyword: boolean;
    weight: boolean;
  };
  isDrawerOpen: boolean;
  keyword: string;
  weight: number;
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

const dataTypes = [
  {
    dataType: 'string',
    formatting: 'string',
    weaviateType: 'string'
  },
  {
    dataType: 'int64',
    formatting: '0',
    weaviateType: 'int'
  },
  {
    dataType: 'boolean',
    formatting: 'true / false',
    weaviateType: 'boolean'
  },
  {
    dataType: 'float64',
    formatting: '0.0',
    weaviateType: 'number'
  },
  {
    dataType: 'string',
    formatting: 'ISO 8601',
    weaviateType: 'date'
  },
  {
    dataType: 'text',
    formatting: 'string',
    weaviateType: 'text'
  },
  {
    dataType: 'string',
    formatting: '0',
    weaviateType: 'CrossRef'
  },
  {
    dataType: 'string',
    formatting: '0',
    weaviateType: 'geoCoordinates'
  }
];

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');

/**
 * Component
 */
class OntologyEditorProperty extends React.Component<
  IOntologyEditorPropertyProps,
  IOntologyEditorPropertyState
> {
  constructor(props: IOntologyEditorPropertyProps) {
    super(props);
    this.state = {
      errors: [],
      form: {
        cardinality: 'atMostOne',
        classReference: undefined,
        ['@dataType']: ['string'],
        description: '',
        keywords: [],
        name: ''
      },
      formErrors: {
        keyword: false,
        name: false,
        weight: false
      },
      isDrawerOpen: false,
      keyword: '',
      weight: 1
    };
  }

  public componentDidMount() {
    const { property } = this.props;
    const { form } = this.state;
    if (typeof property === 'object') {
      this.setState({ form: { ...form, ...property } });
    }
  }

  public setFormField = (name: string) => (event: any) => {
    const { form } = this.state;
    let value = event.target.value;
    if (name === 'keyword') {
      this.setState({ keyword: value });
    } else {
      if (name === '@dataType') {
        value = [value];
      }
      // @ts-ignore
      this.setState({
        form: {
          ...form,
          [name]: value
        }
      });
    }
  };

  public validateFormField = (name: string) => (event: any) => {
    const { formErrors } = this.state;
    const isName = name === 'name';
    const isKeyword = name === 'keyword';
    const isWeight = name === 'weight';

    if (isWeight) {
      if (this.state.weight >= 0 && this.state.weight <= 1) {
        this.setState({
          formErrors: { ...formErrors, weight: false }
        });
      } else {
        this.setState({
          formErrors: { ...formErrors, weight: true }
        });
      }
    }

    if (isName || isKeyword) {
      const words = isName
        ? camelize(this.state.form[name])
        : camelize(this.state[name]);

      if (words === '') {
        this.setState({ formErrors: { ...formErrors, name: true } });
      } else {
        client
          .query({
            query: VALIDATE_WORDS_CONTEXTIONARY_QUERY,
            variables: {
              words
            }
          })
          .then((result: any) => {
            const individualWords = get(
              result,
              'data.validateWordsContextionary.individualWords'
            );
            const notInC11y = individualWords.some((word: any) => !word.inC11y);

            if (notInC11y) {
              if (isName) {
                this.setState({
                  formErrors: { ...formErrors, name: true }
                });
              } else if (isKeyword) {
                this.setState({
                  formErrors: { ...formErrors, keyword: true }
                });
              }
            } else {
              if (isName) {
                this.setState({
                  formErrors: { ...formErrors, name: false }
                });
              } else if (isKeyword) {
                this.setState({
                  formErrors: { ...formErrors, keyword: false }
                });
              }
            }
          })
          .catch(error => {
            this.setState({
              formErrors: { ...formErrors, name: true }
            });
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
    const { form, keyword, weight } = this.state;
    const newKeyword = { keyword, weight: Number(weight) };
    const keywords =
      form.keywords && form.keywords.length
        ? [...form.keywords, newKeyword]
        : [newKeyword];

    if (keyword) {
      this.setState({
        form: { ...form, keywords },
        keyword: '',
        weight: 1
      });
    }
  };

  public deleteKeyword = (keyword: string) => () => {
    const { form } = this.state;

    if (form.keywords) {
      const newKeywords = form.keywords.filter(
        keywordObj => keywordObj.keyword !== keyword
      );
      this.setState({
        form: {
          ...form,
          keywords: newKeywords
        }
      });
    }
  };

  public saveProperty = () => {
    const { form } = this.state;
    const { cardinality, classReference, description, keywords, name } = form;
    const { className, classType } = this.props;
    const DataType =
      form['@dataType'][0] === 'CrossRef' && classReference
        ? [classReference]
        : form['@dataType'];
    const isNewProperty = !this.props.property;

    fetch(
      `${url}schema/${(
        classType || ''
      ).toLowerCase()}/${className}/properties/${isNewProperty ? '' : name}`,
      {
        body: isNewProperty
          ? JSON.stringify({
              '@dataType': DataType,
              cardinality,
              description,
              keywords,
              name
            })
          : JSON.stringify({ keywords }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: isNewProperty ? 'POST' : 'PUT'
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
          this.toggleDrawer();
        }
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public render() {
    const {
      errors,
      form,
      formErrors,
      isDrawerOpen,
      keyword,
      weight
    } = this.state;
    const { cardinality, classReference, description, name } = form;
    const {} = formErrors;
    const { classes, classesSchema, className } = this.props;
    const isNewProperty = !this.props.property;

    return (
      <div className={classes.ontologyActionsContainer}>
        {this.props.property ? (
          <IconButton
            aria-label="Edit thing or action"
            onClick={this.toggleDrawer}
          >
            <CreateIcon />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            onClick={this.toggleDrawer}
            disabled={!className}
          >
            <Typography>Add property</Typography>
          </Button>
        )}

        <Drawer open={isDrawerOpen} classes={{ paper: classes.drawer }}>
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography component="h1" variant="subtitle1" color="inherit">
                {isNewProperty ? 'New' : 'Edit'} property
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Property definition</Typography>

              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    required={true}
                    id="name"
                    name="name"
                    label="Property name"
                    helperText="Helper text"
                    value={name}
                    onChange={this.setFormField('name')}
                    onBlur={this.validateFormField('name')}
                    error={formErrors.name}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty name"
                    disabled={!isNewProperty}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="data-type"
                    select={true}
                    label="Data type"
                    fullWidth={true}
                    value={form['@dataType'][0]}
                    onChange={this.setFormField('@dataType')}
                    helperText="Helper text"
                    margin="normal"
                    disabled={!isNewProperty}
                  >
                    {dataTypes.map((dataTypex, i) => (
                      <MenuItem key={i} value={dataTypex.weaviateType}>
                        {dataTypex.weaviateType}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {form['@dataType'][0] === 'CrossRef' && (
                  <Grid item={true} xs={12}>
                    <TextField
                      id="class-reference"
                      select={true}
                      label="Class reference"
                      fullWidth={true}
                      value={classReference}
                      onChange={this.setFormField('classReference')}
                      helperText="Helper text"
                      margin="normal"
                      disabled={!isNewProperty}
                    >
                      {classesSchema
                        .filter(classSchema => classSchema.class !== className)
                        .map((classSchema, i) => (
                          <MenuItem key={i} value={classSchema.class}>
                            {classSchema.class}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                )}
                {form['@dataType'][0] === 'CrossRef' && (
                  <Grid item={true} xs={12}>
                    <TextField
                      id="cardinality"
                      select={true}
                      label="Cardinality"
                      fullWidth={true}
                      value={cardinality}
                      onChange={this.setFormField('cardinality')}
                      helperText="Helper text"
                      margin="normal"
                      disabled={!isNewProperty}
                    >
                      <MenuItem value={'atMostOne'}>At most one</MenuItem>
                      <MenuItem value={'many'}>Many</MenuItem>
                    </TextField>
                  </Grid>
                )}
                <Grid item={true} xs={12}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    helperText="Helper text"
                    value={description}
                    onChange={this.setFormField('description')}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty description"
                    disabled={!isNewProperty}
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
                    onBlur={this.validateFormField('keyword')}
                    error={formErrors.keyword}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty keyword"
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
                    onBlur={this.validateFormField('weight')}
                    error={formErrors.weight}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty weight"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={2}>
                  <Button
                    variant="text"
                    disabled={formErrors.keyword || formErrors.weight}
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
                      {form.keywords.map((keywordItem, i: number) => (
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

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={formErrors.name}
                  className={classes.button}
                  onClick={this.saveProperty}
                >
                  Save property
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
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditorProperty);
