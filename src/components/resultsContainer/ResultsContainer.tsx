import Typography from '@material-ui/core/Typography';
import React from 'react';
import apolloClient from 'src/apollo/apolloClient';
import { Results, ResultsFragment, Section } from 'src/components';
import { createGqlFragments } from 'src/utils';
import { ClassId } from '../canvas/Canvas';
import {
  SELECTED_CLASSES_QUERY,
  SelectedClassesQuery
} from '../library/queries';
import {
  CLASS_QUERY,
  ClassQuery,
  LINKS_QUERY,
  LinksQuery,
  UPDATE_QUERY_MUTATION
} from './queries';

export interface IFragment {
  hasActiveSourceLinks: boolean;
  hasActiveTargetLinks: boolean;
  queryString: string;
}

interface IResultsContainerState {
  fragments: { [key: string]: IFragment };
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

    const queryString = createGqlFragments(fragments);

    const queryObj = {
      hasActiveSourceLinks: false,
      hasActiveTargetLinks: false,
      queryString
    };

    // Push links to apollo cache
    apolloClient.mutate({
      mutation: UPDATE_QUERY_MUTATION,
      variables: queryObj
    });

    return queryObj;
  }

  public render() {
    return (
      <Section title="Results" shortTitle="Rsl" maxHeight="70vh">
        <SelectedClassesQuery query={SELECTED_CLASSES_QUERY}>
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

            if (!selectedClassesQuery.data) {
              return <Typography color="error">An error occured!</Typography>;
            }

            const selectedClasses =
              selectedClassesQuery.data.canvas.selectedClasses;
            const fragments = this.mergeFragments();

            // Get class information to structure queryString and to add filters
            return (
              <React.Fragment>
                {selectedClasses.map((selectedClassId: ClassId) => {
                  return (
                    <ClassQuery
                      key={selectedClassId}
                      query={CLASS_QUERY}
                      variables={{ id: selectedClassId }}
                    >
                      {classQuery => {
                        if (
                          classQuery.loading ||
                          classQuery.error ||
                          !classQuery.data
                        ) {
                          return null;
                        }
                        return (
                          <LinksQuery query={LINKS_QUERY}>
                            {linksQuery => {
                              if (
                                linksQuery.loading ||
                                linksQuery.error ||
                                !classQuery.data ||
                                !linksQuery.data
                              ) {
                                return null;
                              }

                              const links = linksQuery.data.canvas.links.filter(
                                link =>
                                  link.source === selectedClassId ||
                                  link.target === selectedClassId
                              );

                              const activeSourceLinks = links.filter(
                                link =>
                                  link.source === selectedClassId &&
                                  link.isActive
                              );
                              const activeTargetLinks = links.filter(
                                link =>
                                  link.target === selectedClassId &&
                                  link.isActive
                              );
                              const hasActiveSourceLinks = Boolean(
                                activeSourceLinks.length
                              );
                              const hasActiveTargetLinks = Boolean(
                                activeTargetLinks.length
                              );

                              return (
                                <ResultsFragment
                                  classObj={classQuery.data.class}
                                  cleanString={this.cleanString}
                                  hasActiveSourceLinks={hasActiveSourceLinks}
                                  hasActiveTargetLinks={hasActiveTargetLinks}
                                  links={links}
                                  selectedClassId={selectedClassId}
                                  addFragment={this.addFragment}
                                  removeFragment={this.removeFragment}
                                />
                              );
                            }}
                          </LinksQuery>
                        );
                      }}
                    </ClassQuery>
                  );
                })}

                {fragments && <Results queryString={fragments.queryString} />}
              </React.Fragment>
            );
          }}
        </SelectedClassesQuery>
      </Section>
    );
  }
}

export default ResultsContainer;
