import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';
import defaults from 'src/resolvers/defaults';
import { ClassType } from 'src/types';

/**
 * Types
 */
interface IUpdateClassSelectionCanvasData {
  class: {
    classType: ClassType;
    isSelected: boolean;
    name: string;
  };
  canvas: {
    selectedClass: {
      id: ClassId;
    };
  };
}

interface IUpdateClassSelectionCanvasVariables {
  id: ClassId;
}

/**
 * Query component
 */
export class UpdateClassSelectionCanvasMutation extends Mutation<
  IUpdateClassSelectionCanvasData,
  IUpdateClassSelectionCanvasVariables
> {}

/**
 * GQL query string
 */
export const CLASS_SELECTION_CANVAS_MUTATION = gql`
  mutation updateClassSelectionCanvas($id: String!) {
    updateClassSelectionCanvas(id: $id) @client
  }
`;

/**
 * Actual mutation
 */
const updateClassSelectionCanvas = (
  _: any,
  variables: { id: string },
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const __typename = defaults.canvas.__typename;
  const id = getCacheKey({ __typename });

  const classQuery = cache.readQuery({
    query: gql`
      query SelectedClass($id: String!) {
        class(id: $id) @client {
          filters
          id
          instance
          name
          classLocation
          classType
        }
      }
    `,
    variables: {
      id: variables.id
    }
  });

  const data = {
    canvas: {
      __typename,
      selectedClass: classQuery.class
    }
  };

  cache.writeData({ id, data });
  return null;
};

export default updateClassSelectionCanvas;
