import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
interface IValidateWordsContextionaryData {
  concatenatedWord: any;
  individualWords: any;
}

interface IValidateWordsContextionaryVariables {
  words: string;
}

/**
 * Query component
 */
export class ValidateWordsContextionaryQuery extends Query<
  IValidateWordsContextionaryData,
  IValidateWordsContextionaryVariables
> {}

/**
 * GQL query string
 */
export const VALIDATE_WORDS_CONTEXTIONARY_QUERY = gql`
  query validateWordsContextionary($words: String!) {
    validateWordsContextionary(words: $words)
      @rest(
        type: "Contextionary"
        path: "c11y/words/{args.words}"
        method: "GET"
      ) {
      concatenatedWord
      individualWords
    }
  }
`;
