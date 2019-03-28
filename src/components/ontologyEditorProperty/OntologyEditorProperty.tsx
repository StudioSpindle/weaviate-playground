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
export interface IOntologyEditorPropertyProps
  extends WithStyles<typeof styles> {
  classesSchema: any[];
  className?: string;
  classType?: string;
  classSchemaQuery: QueryResult;
}

export interface IOntologyEditorPropertyState {
  cardinality: string;
  classReference?: string;
  dataType: any;
  description: string;
  isAddKeywordDisabled: boolean;
  isDisabled: boolean;
  isDrawerOpen: boolean;
  keyword: string;
  keywordError: boolean;
  keywords: Keywords;
  propertyName: string;
  propertyNameError: boolean;
  weight: number;
  weightError: boolean;
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
      cardinality: 'atMostOne',
      classReference: undefined,
      dataType: 'string',
      description: '',
      isAddKeywordDisabled: false,
      isDisabled: true,
      isDrawerOpen: false,
      keyword: '',
      keywordError: false,
      keywords: [],
      propertyName: '',
      propertyNameError: false,
      weight: 1,
      weightError: false
    };
  }

  public setFormField = (name: string) => (event: any) => {
    // @ts-ignore
    this.setState({ [name]: event.target.value });
  };

  public validateFormField = (name: string) => (event: any) => {
    const isPropertyName = name === 'propertyName';
    const isKeyword = name === 'keyword';
    const isWeight = name === 'weight';

    if (isWeight) {
      if (this.state.weight >= 0 && this.state.weight <= 1) {
        this.setState({ isAddKeywordDisabled: false, weightError: false });
      } else {
        this.setState({ isAddKeywordDisabled: true, weightError: true });
      }
    }

    if (isPropertyName || isKeyword) {
      if (this.state[name] === '') {
        this.setState({ propertyNameError: true, isDisabled: true });
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
              if (isPropertyName) {
                this.setState({ isDisabled: true, propertyNameError: true });
              } else if (isKeyword) {
                this.setState({
                  isAddKeywordDisabled: true,
                  keywordError: true
                });
              }
            } else {
              if (isPropertyName) {
                this.setState({ isDisabled: false, propertyNameError: false });
              } else if (isKeyword) {
                this.setState({
                  isAddKeywordDisabled: false,
                  keywordError: false
                });
              }
            }
          })
          .catch(error => {
            this.setState({ isDisabled: true, propertyNameError: true });
          });
      }
    }
  };

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;

    this.setState({
      isDrawerOpen: !isDrawerOpen
    });
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

  public saveProperty = () => {
    const {
      cardinality,
      classReference,
      dataType,
      description,
      keywords,
      propertyName
    } = this.state;
    const { className, classType, classSchemaQuery } = this.props;
    const dataTypeObject = dataTypes.find(
      dataTypex => dataTypex.weaviateType === dataType
    );
    const DataType =
      dataType === 'CrossRef' && classReference
        ? classReference
        : dataTypeObject && dataTypeObject.dataType;

    fetch(
      `${url}schema/${(classType || '').toLowerCase()}/${className}/properties`,
      {
        body: JSON.stringify({
          '@dataType': [DataType],
          cardinality,
          description,
          keywords,
          name: propertyName
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )
      .then(res => {
        if (res.status >= 400) {
          this.setState({ isDisabled: true, propertyNameError: true });
          throw new Error('');
        } else {
          return res.json();
        }
      })
      .then(res => {
        classSchemaQuery.refetch();
        this.setState({ isDrawerOpen: false });
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public updateClassProperty = () => {
    const { className, classType } = this.props;
    const { keyword, keywords, weight } = this.state;
    const newKeywords = [...keywords, { keyword, weight: Number(weight) }];

    fetch(
      `${url}schema/${(classType || '').toLowerCase()}/${className}/properties`,
      {
        body: JSON.stringify({ keywords: newKeywords }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }
    )
      .then(res => {
        if (res.status >= 400) {
          this.setState({ isDisabled: true, keywordError: true });
          throw new Error('');
        } else {
          return res.json();
        }
      })
      .then(() => {
        this.setState({ keyword: '', keywords: newKeywords, weight: 1 });
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public render() {
    const {
      cardinality,
      classReference,
      dataType,
      description,
      isAddKeywordDisabled,
      isDisabled,
      isDrawerOpen,
      keyword,
      keywordError,
      keywords,
      propertyName,
      propertyNameError,
      weight,
      weightError
    } = this.state;
    const { classes, classesSchema, className } = this.props;
    const isNewProperty = true;

    return (
      <div className={classes.ontologyActionsContainer}>
        <Button
          variant="outlined"
          onClick={this.toggleDrawer}
          disabled={!className}
        >
          <Typography>Add property</Typography>
        </Button>

        <Drawer
          open={isDrawerOpen}
          onClose={this.toggleDrawer}
          classes={{ paper: classes.drawer }}
        >
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography component="h1" variant="subtitle1" color="inherit">
                New property
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
                    id="propertyName"
                    name="propertyName"
                    label="Property name"
                    helperText="Helper text"
                    value={propertyName}
                    onChange={this.setFormField('propertyName')}
                    onBlur={this.validateFormField('propertyName')}
                    error={propertyNameError}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty propertyName"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="data-type"
                    select={true}
                    label="Data type"
                    fullWidth={true}
                    value={dataType}
                    onChange={this.setFormField('dataType')}
                    helperText="Helper text"
                    margin="normal"
                  >
                    {dataTypes.map((dataTypex, i) => (
                      <MenuItem key={i} value={dataTypex.weaviateType}>
                        {dataTypex.weaviateType}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {dataType === 'CrossRef' && (
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
                {dataType === 'CrossRef' && (
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
                    error={keywordError}
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
                    error={weightError}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty weight"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={2}>
                  <Button
                    variant="text"
                    disabled={isAddKeywordDisabled}
                    onClick={
                      isNewProperty ? this.addKeyword : this.updateClassProperty
                    }
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

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={isDisabled}
                  className={classes.button}
                  onClick={this.saveProperty}
                >
                  Save property
                </Button>
              </div>
            </Paper>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditorProperty);
