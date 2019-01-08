import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withTheme from '@material-ui/core/styles/withTheme';
import * as React from 'react';
// import { Sankey } from 'react-vis';

interface IResultsSankey {
  data: any;
  theme: Theme;
}

interface ISankeyNode {
  name: string;
  class: string;
  color?: string;
  opacity?: number;
  key?: string;
  rotation?: number;
}

interface ISankeyLink {
  source: number;
  target: number;
  value: number;
  color?: string;
  opacity?: number;
  key?: string;
}

class ResultsSankey extends React.Component<IResultsSankey> {
  public getNodes() {
    const { data, theme } = this.props;
    const nodes: ISankeyNode[] = [];
    const classes = { ...data.Local.Get.Things, ...data.Local.Get.Actions };

    Object.keys(classes)
      .filter(className => className !== '__typename')
      .forEach(className =>
        classes[className].forEach((node: any) => {
          nodes.push({
            class: className,
            name: node.name
          });
        })
      );

    return nodes.map(node => {
      if (!node.color) {
        node.color = theme.palette.primary.main;
      }
      if (!node.rotation) {
        node.rotation = 0;
      }
      return node;
    });
  }

  public getLinks() {
    const { theme } = this.props;

    const links: ISankeyLink[] = [
      { source: 0, target: 1, value: 20 },
      { source: 0, target: 2, value: 20 },
      { source: 1, target: 2, value: 20 }
    ];

    return links.map(link => {
      if (!link.color) {
        link.color = theme.palette.grey[100];
      }
      return link;
    });
  }

  public render() {
    // const links = this.getLinks();
    // const nodes = this.getNodes();

    // return (
    //   <Sankey
    //     nodes={nodes}
    //     links={links}
    //     width={400}
    //     height={200}
    //     labelRotation={45}
    //   />
    // );
    return null;
  }
}

export default withTheme()(ResultsSankey);
