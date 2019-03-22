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
import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation, QueryResult } from 'react-apollo';
import { Keywords } from 'src/types';
import {
  UPDATE_CLASS_PROPERTY_MUTATION,
  UpdateClassPropertyMutation
} from './queries';

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
  isDisabled: boolean;
  isDrawerOpen: boolean;
  keyword: string;
  keywords: Keywords;
  weight: number;
  propertyName: string;
  propertyNameError: boolean;
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
      isDisabled: true,
      isDrawerOpen: false,
      keyword: '',
      keywords: [],
      propertyName: '',
      propertyNameError: false,
      weight: 0
    };
  }

  public setFormField = (name: string) => (event: any) => {
    // @ts-ignore
    this.setState({ [name]: event.target.value });
  };

  public validateFormField = (name: string) => (event: any) => {
    const { propertyName } = this.state;
    if (name === 'className') {
      if (propertyName === '') {
        this.setState({
          isDisabled: true,
          propertyNameError: true
        });
      } else {
        this.setState({ isDisabled: false, propertyNameError: false });
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
        weight: 0
      });
    }
  };

  public savePropertyMutation = (savePropertyMutation: any) => {
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

    savePropertyMutation({
      variables: {
        body: {
          '@dataType': [DataType],
          cardinality,
          description,
          keywords,
          name: propertyName
        },
        className,
        classType: (classType || '').toLowerCase()
      }
    })
      .then(() => {
        classSchemaQuery.refetch();
        this.setState({ isDrawerOpen: false });
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public updateClassPropertyMutation = (updateClassPropertyMutation: any) => {
    const { className, classType } = this.props;
    const { keyword, keywords, weight } = this.state;
    const newKeywords = [...keywords, { keyword, weight: Number(weight) }];

    updateClassPropertyMutation({
      variables: {
        body: {
          keywords: newKeywords
        },
        className,
        classType: (classType || '').toLowerCase()
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
      cardinality,
      classReference,
      dataType,
      description,
      isDrawerOpen,
      keyword,
      keywords,
      propertyName,
      weight
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
              <Typography color="inherit">New property</Typography>
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
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty weight"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={2}>
                  <UpdateClassPropertyMutation
                    mutation={UPDATE_CLASS_PROPERTY_MUTATION}
                  >
                    {updateClassPropertyMutation => (
                      <Button
                        variant="text"
                        onClick={
                          isNewProperty
                            ? this.addKeyword
                            : this.updateClassPropertyMutation.bind(
                                null,
                                updateClassPropertyMutation
                              )
                        }
                      >
                        Add
                      </Button>
                    )}
                  </UpdateClassPropertyMutation>
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
                <Mutation
                  mutation={gql`
                    mutation createClass(
                      $classType: String!
                      $className: String!
                      $body: Body!
                    ) {
                      saveProperty(
                        classType: $classType
                        className: $className
                        body: $body
                      )
                        @rest(
                          type: "Class"
                          path: "schema/{args.classType}/{args.className}/properties"
                          method: "POST"
                          bodyKey: "body"
                        ) {
                        NoResponse
                      }
                    }
                  `}
                >
                  {(savePropertyMutation, result) => (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      className={classes.button}
                      onClick={this.savePropertyMutation.bind(
                        null,
                        savePropertyMutation
                      )}
                    >
                      Save property
                    </Button>
                  )}
                </Mutation>
              </div>
            </Paper>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditorProperty);
