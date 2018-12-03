import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withTheme from '@material-ui/core/styles/withTheme';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import * as React from 'react';
import { compose } from 'react-apollo';
import { Graph } from 'react-d3-graph';
import client from 'src/apolloClient';
import { CanvasClass } from 'src/components';
import { GET_META_TYPE } from '../filters/queries';

/**
 * Types
 */

export type ClassId = string;

export interface ID3Link {
  target: ClassId;
  source: ClassId;
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
    }
  });

const onClickLink = (source: any, target: any, and: any) => {
  // tslint:disable-next-line:no-console
  console.log(`Clicked link between ${source} and ${target}`);
};

const onMouseOverLink = (source: any, target: any) => {
  // tslint:disable-next-line:no-console
  console.log(`Mouse over in link between ${source} and ${target}`);
};

const onMouseOutLink = (source: any, target: any) => {
  // tslint:disable-next-line:no-console
  console.log(`Mouse out link between ${source} and ${target}`);
};

class Canvas extends React.Component<ICanvasProps, ICanvasState> {
  constructor(props: ICanvasProps) {
    super(props);
    this.state = { graph: { links: [], nodes: [] } };
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
      query: GET_META_TYPE,
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
        const classLocation = classIdParts[0];
        const classType = classIdParts[1];
        const className = classIdParts[classIdParts.length - 1];

        // Get metaData for class
        const metaTypeClass: any = await this.getMetaType(`Meta${className}`);

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
            const classLocationCapitalized =
              classLocation.charAt(0).toUpperCase() + classLocation.slice(1);
            const fieldName = linkingField.__type.name;
            const fieldNameCapitalized =
              fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            const queryString = `
              query MetaDataForFilter {
                ${classLocationCapitalized} {
                  Get {
                    ${classType} {
                      ${className} {
                        ${fieldNameCapitalized} {
                          __typename
                        }
                      }
                    }
                  }
                }
              }
            `;

            const queryResult: any = await client.query({
              query: gql(queryString)
            });

            const targetTypename =
              queryResult.data[classLocationCapitalized].Get[classType][
                className
              ][0][fieldNameCapitalized].__typename;

            // Create link when linking class is in canvas
            const classIdTarget = `${classLocation}-${classType}-${targetTypename}`;

            if (selectedClasses.includes(classIdTarget)) {
              return {
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

  public render() {
    const { graph } = this.state;
    const { classes, width, height, theme } = this.props;

    const config = {
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
            <Typography variant="h6" gutterBottom={true}>
              There are no nodes in the playground
            </Typography>
            <Typography>Add nodes from the library</Typography>
          </div>
        </div>
      );
    }

    return (
      <Graph
        id="canvas"
        data={graph}
        config={config}
        onClickLink={onClickLink}
        onMouseOverLink={onMouseOverLink}
        onMouseOutLink={onMouseOutLink}
      />
    );
  }
}

export default compose(
  withTheme(),
  withStyles(styles)
)(Canvas);
