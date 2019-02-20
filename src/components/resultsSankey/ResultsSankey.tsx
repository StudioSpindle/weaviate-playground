import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withTheme from '@material-ui/core/styles/withTheme';
import get from 'get-value';
import * as React from 'react';
import Chart from 'react-google-charts';

interface IResultsSankeyProps {
  data: any;
  theme: Theme;
}

type ISankeyConnection = any[];

const getLabel = (node: any) => {
  if (node.name && typeof node.name === 'string') {
    return node.name;
  } else if (node.title && typeof node.title === 'string') {
    return node.title;
  } else if (node.uuid && typeof node.uuid === 'string') {
    return node.uuid;
  }

  return 'Unknown label';
};

class ResultsSankey extends React.Component<IResultsSankeyProps> {
  public getConnections(): ISankeyConnection {
    const { data } = this.props;
    if (data) {
      const LocalThings = get(data, 'Local.Get.Things');
      const LocalActions = get(data, 'Local.Get.Actions');
      const rootClasses = {
        ...LocalThings,
        ...LocalActions
      };
      const rootNodes = Object.keys(rootClasses)
        .filter(className => className !== '__typename')
        .map(className => rootClasses[className])
        .flat(1);
      const connections: ISankeyConnection = [];

      const createConnections = (node: any) => {
        const source = getLabel(node);

        Object.keys(node).forEach(key => {
          const property = node[key];

          if (property !== null && typeof property === 'object') {
            const target = getLabel(property);

            if (source !== 'Unknown label' && target !== 'Unknown label') {
              connections.push([source, target, 1]);
            }

            createConnections(property);
          }
        });
      };

      rootNodes.forEach(createConnections);

      return connections;
    }
    return [];
  }

  public render() {
    const connections = this.getConnections();

    return (
      <Chart
        chartType="Sankey"
        data={[['From', 'To', 'Weight'], ...connections]}
      />
    );
  }
}

export default withTheme()(ResultsSankey);
