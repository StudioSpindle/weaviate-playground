import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import * as React from 'react';
import client from 'src/apollo/apolloClient';
import { ResultsJson, ResultsSankey } from 'src/components';
import { JsonIcon, SankeyIcon } from '../icons';

interface IResultsProps extends WithStyles<typeof styles> {
  queryString?: string;
}

interface IResultsState {
  data: any;
  errors?: any[];
  selectedTab?: number;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    tabContainer: {
      border: `1px solid ${theme.palette.grey[100]}`,
      margin: '1em'
    },
    tabContainerInline: {
      margin: '1em'
    },
    tabSubcontainer: {
      border: `1px solid ${theme.palette.grey[100]}`,
      margin: '1em'
    },
    warning: {
      padding: '1em'
    }
  });

class Results extends React.Component<IResultsProps, IResultsState> {
  constructor(props: IResultsProps) {
    super(props);
    this.state = {
      data: {},
      errors: undefined,
      selectedTab: 1
    };
  }

  public componentDidMount() {
    this.fetchData();
  }

  public componentDidUpdate(prevProps: IResultsProps) {
    const { queryString } = this.props;
    if (queryString !== prevProps.queryString) {
      this.fetchData();
    }
  }

  public async fetchData() {
    const { queryString } = this.props;

    if (queryString === '') {
      return;
    }

    const { data, errors }: any = await client.query({
      query: gql(queryString)
    });

    this.setState({ data, errors });
  }

  public changeTab = (event: any, value: number) => {
    this.setState({ selectedTab: value });
  };

  public render() {
    const { data, errors, selectedTab } = this.state;
    const { classes, queryString } = this.props;
    const hasValidQueryString = queryString !== '';

    return (
      <React.Fragment>
        <AppBar position="static" color="inherit" elevation={0}>
          <Tabs value={selectedTab} onChange={this.changeTab}>
            <Tab icon={<SankeyIcon />} />
            <Tab icon={<JsonIcon />} />
          </Tabs>
        </AppBar>
        <Divider />
        {!hasValidQueryString ? (
          <div className={`${classes.tabSubcontainer} ${classes.warning}`}>
            <Typography color="error">
              No link or multiple link paths selected
            </Typography>
          </div>
        ) : (
          <React.Fragment>
            {selectedTab === 0 && (
              <div className={classes.tabSubcontainer}>
                <ResultsSankey data={data} />
              </div>
            )}
            {selectedTab === 1 && (
              <React.Fragment>
                <div className={classes.tabContainer}>
                  <div className={classes.tabContainerInline}>
                    <Typography variant="subtitle1">
                      GraphQL response
                    </Typography>
                  </div>

                  <Divider />
                  <div className={classes.tabSubcontainer}>
                    <ResultsJson
                      data={
                        errors && errors.length
                          ? JSON.stringify(errors[0], undefined, 4)
                          : JSON.stringify(data, undefined, 4)
                      }
                    />
                  </div>
                </div>

                <div className={classes.tabContainer}>
                  <div className={classes.tabContainerInline}>
                    {' '}
                    <Typography variant="subtitle1">GraphQL query</Typography>
                  </div>

                  <Divider />
                  <div className={classes.tabSubcontainer}>
                    <ResultsJson data={queryString} isGraphQL={true} />
                  </div>
                  <div className={classes.tabContainerInline}>
                    <Button
                      variant="outlined"
                      color="primary"
                      component="a"
                      href={`${
                        window.location.href
                      }&graphiql=true&query="${queryString}"`}
                      target="_blank"
                    >
                      <Typography>Run in GraphiQL</Typography>
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Results);
