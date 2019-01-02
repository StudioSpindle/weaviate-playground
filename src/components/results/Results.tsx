import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import gql from 'graphql-tag';
import * as React from 'react';
import client from 'src/apollo/apolloClient';
import { ResultsJson, ResultsSankey } from 'src/components';
import { IWeaviateLocalGetWhereInpObj } from 'src/types';
import { JsonIcon, SankeyIcon, SwarmIcon } from '../icons';

interface IResultsProps extends WithStyles<typeof styles> {
  queryString?: string;
  where?: IWeaviateLocalGetWhereInpObj;
}

interface IResultsState {
  data: any;
  selectedTab?: number;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    tabContainer: {
      border: `1px solid ${theme.palette.grey[100]}`,
      margin: '1em',
      padding: '1em'
    }
  });

class Results extends React.Component<IResultsProps, IResultsState> {
  constructor(props: IResultsProps) {
    super(props);
    this.state = {
      data: {},
      selectedTab: 2
    };
  }

  public componentDidMount() {
    this.fetchData();
  }

  public componentDidUpdate(prevProps: IResultsProps) {
    const { queryString, where } = this.props;
    if (queryString !== prevProps.queryString || where !== prevProps.where) {
      this.fetchData();
    }
  }

  public async fetchData() {
    const { queryString, where } = this.props;
    const { data }: any = await client.query({
      query: gql(queryString),
      variables: { where }
    });

    this.setState({ data });
  }

  public changeTab = (event: any, value: number) => {
    this.setState({ selectedTab: value });
  };

  public render() {
    const { data, selectedTab } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <AppBar position="static" color="inherit" elevation={0}>
          <Tabs value={selectedTab} onChange={this.changeTab}>
            <Tab icon={<SankeyIcon />} />
            <Tab icon={<SwarmIcon />} />
            <Tab icon={<JsonIcon />} />
          </Tabs>
        </AppBar>
        <Divider />
        {selectedTab === 0 && (
          <div className={classes.tabContainer}>
            <ResultsSankey data={data} />
          </div>
        )}
        {selectedTab === 1 && (
          <div className={classes.tabContainer}>Swarm diagram</div>
        )}
        {selectedTab === 2 && (
          <div className={classes.tabContainer}>
            <ResultsJson data={data} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Results);
