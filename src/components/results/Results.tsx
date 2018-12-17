// tslint:disable-next-line:ordered-imports
import { AppBar, Tab, Tabs } from '@material-ui/core';
import gql from 'graphql-tag';
import * as React from 'react';
import client from 'src/apolloClient';
import { IWeaviateLocalGetWhereInpObj } from 'src/types';
import { JsonIcon, SankeyIcon, SwarmIcon } from '../icons';

interface IResultsProps {
  queryString?: string;
  where?: IWeaviateLocalGetWhereInpObj;
}

interface IResultsState {
  data: any;
  selectedTab?: number;
}

const TabContainer = ({ children }: { children: any }) => {
  return (
    <div style={{ margin: '1em', padding: '1em', border: '1px solid black' }}>
      {children}
    </div>
  );
};

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

    return (
      <React.Fragment>
        <AppBar position="static">
          <Tabs value={selectedTab} onChange={this.changeTab}>
            <Tab icon={<SankeyIcon />} />
            <Tab icon={<SwarmIcon />} />
            <Tab icon={<JsonIcon />} />
          </Tabs>
        </AppBar>
        {selectedTab === 0 && <TabContainer>Sankey diagram</TabContainer>}
        {selectedTab === 1 && <TabContainer>Swarm diagram</TabContainer>}
        {selectedTab === 2 && (
          <TabContainer>
            <textarea
              style={{ height: '100%', width: '100%', border: 'none' }}
              rows={25}
              value={JSON.stringify(data, undefined, 4)}
              readOnly={true}
            />
          </TabContainer>
        )}
      </React.Fragment>
    );
  }
}

export default Results;
