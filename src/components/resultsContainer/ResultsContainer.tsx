import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { Results, ResultsFragment, Section } from 'src/components';
import { ClassId } from '../canvas/Canvas';

type WhereOperatorEnum =
  | 'And'
  | 'Or'
  | 'Equal'
  | 'Not'
  | 'NotEqual'
  | 'GreaterThan'
  | 'GreaterThanEqual'
  | 'LessThan'
  | 'LessThanEqual';

interface IWhereOperandsInpObj {
  operator: WhereOperatorEnum;
  operands: IWhereOperandsInpObj[];
  path?: string[];
  valueInt?: number;
  valueNumter?: number;
  valueBoolean?: boolean;
  valueString?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IWeaviateLocalGetWhereInpObj extends IWhereOperandsInpObj {}

export interface IFragment {
  queryString: string;
  where?: IWeaviateLocalGetWhereInpObj;
}

interface IResultsContainerState {
  fragments: {};
}

class ResultsContainer extends React.Component<{}, IResultsContainerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      fragments: {}
    };
  }

  public cleanString(textString: string) {
    return textString.replace(/-/g, '');
  }

  public addFragment = (classId: ClassId, fragment: IFragment) => {
    const { fragments } = this.state;
    const cleanClassId = this.cleanString(classId);
    this.setState({
      fragments: {
        ...fragments,
        [cleanClassId]: fragment
      }
    });
  };

  public removeFragment = (classId: ClassId) => {
    const cleanClassId = this.cleanString(classId);
    const {
      fragments: { [cleanClassId]: value, ...rest }
    } = this.state;
    this.setState({
      fragments: rest
    });
  };

  public mergeFragments(): IFragment | undefined {
    const { fragments } = this.state;
    const fragmentKeys = Object.keys(fragments);

    if (!fragmentKeys.length) {
      return undefined;
    }

    const referFragment = (fragmentKey: string) => `...${fragmentKey}`;

    const localKeys = fragmentKeys.filter(fragmentKey =>
      fragmentKey.startsWith('local')
    );

    const networkKeys = fragmentKeys.filter(
      fragmentKey => !fragmentKey.startsWith('local')
    );

    const queryString = `
      query SelectedClassesWithFilters($where: WeaviateLocalGetWhereInpObj) {
        ${
          localKeys.length
            ? `Local {
                ${localKeys.map(referFragment)}
              }`
            : ''
        }
        ${
          networkKeys.length
            ? `Network {
                ${networkKeys.map(referFragment)}
              }`
            : ''
        }
      }
      ${[...localKeys, ...networkKeys]
        .map(fragmentKey => fragments[fragmentKey].queryString)
        .join(' ')}
  `;

    const operands = localKeys
      .filter(fragmentKey => Boolean(fragments[fragmentKey].where))
      .map(fragmentKey => fragments[fragmentKey].where);

    const where = operands.length
      ? ({
          operands,
          operator: 'And'
        } as IWeaviateLocalGetWhereInpObj)
      : undefined;

    return {
      queryString,
      where
    };
  }

  public render() {
    return (
      <Section title="Results">
        <Query
          query={gql`
            query selectedClasses {
              canvas @client {
                selectedClasses
              }
            }
          `}
        >
          {selectedClassesQuery => {
            if (selectedClassesQuery.loading) {
              return 'Loading...';
            }

            if (selectedClassesQuery.error) {
              return (
                <Typography color="error">
                  {selectedClassesQuery.error.message}
                </Typography>
              );
            }

            const selectedClasses =
              selectedClassesQuery.data.canvas.selectedClasses;
            const fragments = this.mergeFragments();

            // Get class information to structure queryString and to add filters
            return (
              <React.Fragment>
                {selectedClasses.map((selectedClassId: ClassId) => {
                  return (
                    <Query
                      key={selectedClassId}
                      query={gql`
                        query SelectedClass($id: String!) {
                          class(id: $id) {
                            id
                            classType
                            classLocation
                            filters
                            instance
                            name
                          }
                        }
                      `}
                      variables={{ id: selectedClassId }}
                    >
                      {classQuery => {
                        if (classQuery.loading || classQuery.error) {
                          return null;
                        }

                        return (
                          <ResultsFragment
                            classObj={classQuery.data.class}
                            cleanString={this.cleanString}
                            selectedClassId={selectedClassId}
                            addFragment={this.addFragment}
                            removeFragment={this.removeFragment}
                          />
                        );
                      }}
                    </Query>
                  );
                })}

                {fragments && (
                  <Results
                    queryString={fragments.queryString}
                    where={fragments.where}
                  />
                )}
              </React.Fragment>
            );
          }}
        </Query>
      </Section>
    );
  }
}

export default ResultsContainer;
