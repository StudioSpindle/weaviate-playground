import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ClassId } from 'src/components/canvas/Canvas';

/**
 * Types
 */
interface IOntologyEditorClassNameData {
  class: {
    name: string;
  };
}

interface IOntologyEditorClassNameVariables {
  id: ClassId;
}

/**
 * Query component
 */
export class OntologyEditorClassNameQuery extends Query<
  IOntologyEditorClassNameData,
  IOntologyEditorClassNameVariables
> {}

/**
 * GQL query string
 */
export const ONTOLOGY_EDITOR_CLASS_NAME_QUERY = gql`
  query GetOntologyEditorClassName($id: String!) {
    class(id: $id) @client {
      id
      name
    }
  }
`;
