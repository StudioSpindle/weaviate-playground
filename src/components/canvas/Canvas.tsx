import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withTheme from '@material-ui/core/styles/withTheme';
import Typography from '@material-ui/core/Typography';
import get from 'get-value';
import gql from 'graphql-tag';
import * as React from 'react';
import { compose } from 'react-apollo';
import { Graph } from 'react-d3-graph';
import client from 'src/apollo/apolloClient';
import { CanvasClass } from 'src/components';
import { createGqlGet } from 'src/utils';
import { META_TYPE_QUERY } from '../filters/queries';
import { SELECTED_CLASS_QUERY, SelectedClassQuery } from './queries';

/**
 * Types
 */

export type ClassId = string;

export interface ID3Link {
  target: ClassId;
  source: ClassId;
  isActive?: boolean;
}

export interface ID3Node {
  id: ClassId;
  group: number;
}

interface ICanvasProps extends WithStyles<typeof styles> {
  width: number;
  height: number;
  selectedClasses: ClassId[];
  theme: Theme;
}

interface ICanvasState {
  graph: {
    focusedNodeId?: ClassId;
    links: ID3Link[];
    nodes: ID3Node[];
  };
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      'g.node > svg': {
        overflow: 'visible'
      }
    },
    container: {
      alignItems: 'center',
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      width: '100%'
    },
    messageBox: {
      alignItems: 'center',
      border: `2px dashed ${theme.palette.grey[200]}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '32px 48px'
    },
    noNodesText: {
      color: theme.palette.grey[400]
    }
  });

const onMouseOverLink = (source: any, target: any) => {
  // tslint:disable-next-line:no-console
  console.log(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = (source: any, target: any) => {
  // tslint:disable-next-line:no-console
  console.log(`Mouse out link between ${source} and ${target}`);
};

class Canvas extends React.PureComponent<ICanvasProps, ICanvasState> {
  constructor(props: ICanvasProps) {
    super(props);
    this.state = { graph: { focusedNodeId: undefined, links: [], nodes: [] } };
  }

  public componentDidMount() {
    this.getGraphData();
  }

  public componentDidUpdate(prevProps: ICanvasProps) {
    const { selectedClasses } = this.props;
    if (prevProps.selectedClasses !== selectedClasses) {
      this.getGraphData();
    }
  }

  public async getMetaType(typename: string) {
    const { data }: any = await client.query({
      query: META_TYPE_QUERY,
      variables: { typename }
    });
    return data;
  }

  public getClasses = (selectedClasses: ClassId[]): any[] =>
    selectedClasses.map((classId: string) => ({
      group: 1,
      id: classId
    }));

  public getLinks = async (selectedClasses: ClassId[]): Promise<any[]> => {
    const selectedClassesLinksPromises = selectedClasses.map(
      async (classId: string) => {
        const classIdParts = classId.split('-');
        const instance = classIdParts[0];
        const classType = classIdParts[1];
        const className = classIdParts[classIdParts.length - 1];
        const typename =
          instance === 'local'
            ? `Meta${className}`
            : `${instance}Meta${className}`;

        // Get metaData for class
        const metaTypeClass: any = await this.getMetaType(typename);

        if (!metaTypeClass.__type) {
          // tslint:disable-next-line:no-console
          console.log(`Missing meta data for ${typename}`);
          return [];
        }

        // Get metaData for class fields
        const metaDataClassFields = await Promise.all(
          metaTypeClass.__type.fields.map(async (field: any) => {
            const metaDataClassField = await this.getMetaType(field.type.name);
            return {
              __type: {
                ...metaDataClassField.__type,
                name: field.name
              }
            };
          })
        );

        // Filter class field metaData that have links to another class
        const metaDataLinkingClassFields = metaDataClassFields.filter(
          (data: any) =>
            data.__type.fields.some((field: any) => field.name === 'pointingTo')
        );

        // Get the id of the linking class
        const links = await Promise.all(
          metaDataLinkingClassFields.map(async (linkingField: any) => {
            const fieldName = linkingField.__type.name;
            const fieldNameCapitalized =
              fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            const isLocal = instance === 'local';

            const queryString = createGqlGet({
              className,
              classType,
              instance,
              properties: `${fieldNameCapitalized} { __typename }`,
              reference: 'GetTypeName',
              type: 'Get'
            });

            const queryResult: any = await client.query({
              query: gql(queryString)
            });

            const targetTypename = isLocal
              ? get(
                  queryResult,
                  `data.Local.Get.${classType}.${className}.0.${fieldNameCapitalized}.__typename`
                )
              : get(
                  queryResult,
                  `data.Network.Get.${instance}.${classType}.${className}.0.${fieldNameCapitalized}.__typename`
                );

            // Create link when linking class is in canvas
            const classIdTarget = `${instance}-${classType}-${targetTypename}`;

            if (selectedClasses.includes(classIdTarget)) {
              return {
                color: 'blue',
                source: classId,
                target: classIdTarget,
                value: fieldNameCapitalized
              };
            }

            return null;
          })
        );

        return links.filter(Boolean);
      }
    );

    const selectedClassesLinks = await Promise.all(
      selectedClassesLinksPromises
    );

    return selectedClassesLinks.reduce(
      (acc, val) => [...acc, ...val.filter(Boolean)],
      []
    );
  };

  public async getGraphData() {
    const { data }: any = await client.query({
      query: gql`
        query selectedClasses {
          canvas @client {
            selectedClasses
          }
        }
      `
    });

    const selectedClasses = data.canvas.selectedClasses;

    const graph = {
      links: await this.getLinks(selectedClasses),
      nodes: await this.getClasses(selectedClasses)
    };

    this.setState({ graph });
  }

  public onClickLink = (source: any, target: any) => {
    const { links } = this.state.graph;
    const index = links.findIndex(
      link => link.source === source && link.target === target
    );
    const targetLink = links[index];
    const updatedLink = {
      ...targetLink,
      color: 'green',
      isActive: !targetLink.isActive
    };

    links[index] = updatedLink;
    this.setState({
      graph: {
        ...this.state.graph,
        links
      }
    });
  };

  public render() {
    const { graph } = this.state;
    const { classes, width, height, theme } = this.props;

    const config = {
      automaticRearrangeAfterDropNode: true,
      d3: {
        gravity: -1200
      },
      directed: true,
      height,
      link: {
        highlightColor: theme.palette.secondary.main
      },
      node: {
        renderLabel: false,
        size: 1200,
        viewGenerator: (node: any) => (
          <CanvasClass key={node.id} classId={node.id} node={node} />
        )
      },
      nodeHighlightBehavior: true,
      width
    };

    if (graph.nodes.length === 0) {
      return (
        <div className={classes.container}>
          <div className={classes.messageBox}>
            <Typography
              variant="h6"
              gutterBottom={true}
              className={classes.noNodesText}
            >
              There are no nodes in the playground
            </Typography>
            <Typography className={classes.noNodesText}>
              Add nodes from the library
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <SelectedClassQuery query={SELECTED_CLASS_QUERY}>
        {(selectedClassQuery: any) => {
          if (selectedClassQuery.loading) {
            return 'Loading...';
          }

          if (selectedClassQuery.error) {
            return (
              <Typography color="error">
                {selectedClassQuery.error.message}
              </Typography>
            );
          }

          const focusedNodeId = selectedClassQuery.data.canvas.selectedClass.id;
          return (
            <Graph
              id="canvas"
              data={{ ...graph, focusedNodeId }}
              config={config}
              onClickLink={this.onClickLink}
              onMouseOverLink={onMouseOverLink}
              onMouseOutLink={onMouseOutLink}
            />
          );
        }}
      </SelectedClassQuery>
    );
  }
}

export default compose(
  withTheme(),
  withStyles(styles)
)(Canvas);
