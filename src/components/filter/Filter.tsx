import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import {
  FilterTextSearch,
  RangeSlider,
  Text,
  ToggleSwitch
} from 'src/components';
import {
  GET_META_TYPE,
  GetMetaTypeQuery
} from 'src/components/filters/queries';
import {
  TOGGLE_SWITCH_MUTATION,
  ToggleSwitchMutation
} from 'src/components/filterToggleSwitch/queries';
import { unCamelCase } from 'src/utils';
import styled from 'styled-components';
import {
  GET_SELECTED_CLASS_FOR_FILTER,
  GetSelectedClassForFilterQuery
} from './queries';

/**
 * Types
 */
export interface IFilterProps {
  classNameAlt?: string;
  name: string;
  typename: string;
}

export interface IFilterState {
  isOpen: boolean;
}

export interface IDefaultFilterProps {
  classId: string;
  filterName: string;
  filterType: string;
  filterValue: string | boolean | object;
}

/**
 * Styled components
 */
const Container = styled.div`
  margin: 0.5em;
  border-bottom: solid 1px #eae7e7;
`;

const Section = styled.div`
  padding: 0.5em;
  border-top: solid 1px #eae7e7;
  border-right: solid 1px #eae7e7;
  border-left: solid 1px #eae7e7;
`;

const FilterHeader = styled.button`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: none;
`;

const getTypename = (parentTypename: string, fieldName: string) =>
  parentTypename.replace(
    'Obj',
    `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Obj`
  );

const createQueryString = (parentTypename: string, fields: any) =>
  fields
    .map((field: any) => {
      if (field.type.name || field.name === 'pointingTo') {
        return `${field.name}`;
      }

      if (field.name === 'topOccurrences') {
        return `${field.name} { value, occurs }`;
      }

      // tslint:disable-next-line:no-console
      console.log(`Couldn't fetch ${getTypename(parentTypename, field.name)}`);
      return null;
    })
    .join();

/**
 * Filter component: dynamically fetches filter specs and renders filter
 */
class Filter extends React.Component<IFilterProps, IFilterState> {
  constructor(props: IFilterProps) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  public toggleFilter = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  public render() {
    const { classNameAlt, name, typename } = this.props;
    const { isOpen } = this.state;

    return (
      <Container>
        <Section>
          <FilterHeader onClick={this.toggleFilter}>
            <Text textTransform="capitalize">{unCamelCase(name)}</Text>
            <Text>{isOpen ? 'close' : 'open'}</Text>
          </FilterHeader>
        </Section>
        {isOpen && (
          <Section>
            <GetMetaTypeQuery query={GET_META_TYPE} variables={{ typename }}>
              {metaTypeQuery => {
                if (metaTypeQuery.loading) {
                  return 'Loading...';
                }

                if (metaTypeQuery.error) {
                  return metaTypeQuery.error.message;
                }

                return (
                  <GetSelectedClassForFilterQuery
                    query={GET_SELECTED_CLASS_FOR_FILTER}
                  >
                    {selectedClassQuery => {
                      if (selectedClassQuery.loading) {
                        return 'Loading...';
                      }

                      if (selectedClassQuery.error) {
                        return selectedClassQuery.error.message;
                      }

                      if (!selectedClassQuery.data || !metaTypeQuery.data) {
                        // TODO: Replace with proper message
                        return null;
                      }

                      /**
                       * Create a query string from meta type
                       */
                      const {
                        id,
                        classLocation,
                        classType
                      } = selectedClassQuery.data.canvas.selectedClass;
                      const className =
                        classNameAlt ||
                        selectedClassQuery.data.canvas.selectedClass.name;

                      const queryString = createQueryString(
                        typename,
                        metaTypeQuery.data.__type.fields
                      );

                      const qs = `
                        query MetaDataForFilter {
                          ${classLocation} {
                            GetMeta {
                              ${classType} {
                                ${className} {
                                  ${name} {
                                    ${queryString}
                                  }
                                }
                              }
                            }
                          }
                        }
                      `;

                      const query = gql(qs);

                      return (
                        <Query query={query} variables={{ id }}>
                          {filterMetaQuery => {
                            /**
                             * Get meta data for filter
                             */
                            if (filterMetaQuery.loading) {
                              return 'Loading...';
                            }

                            if (filterMetaQuery.error) {
                              return filterMetaQuery.error.message;
                            }

                            if (!filterMetaQuery.data) {
                              // TODO: Replace with proper message
                              return null;
                            }

                            const metaData =
                              filterMetaQuery.data[classLocation].GetMeta[
                                classType
                              ][className][name];

                            const queryX = gql`
                              query ClassFilters {
                                class(id: $id) @client {
                                  id
                                  filters
                                }
                              }
                            `;

                            return (
                              <Query query={queryX} variables={{ id }}>
                                {classFiltersQuery => {
                                  /**
                                   * Get meta data for filter
                                   */
                                  if (classFiltersQuery.loading) {
                                    return 'Loading...';
                                  }

                                  if (classFiltersQuery.error) {
                                    return classFiltersQuery.error.message;
                                  }

                                  if (!classFiltersQuery.data) {
                                    // TODO: Replace with proper message
                                    return null;
                                  }

                                  if (!metaData) {
                                    return 'An error has occured';
                                  }

                                  const filters = JSON.parse(
                                    classFiltersQuery.data.class.filters
                                  );
                                  const filterValue = filters[name];

                                  const defaultFilterProps = {
                                    classId: id,
                                    filterName: name,
                                    filterType: metaData.type,
                                    filterValue
                                  };
                                  return (
                                    <ToggleSwitchMutation
                                      mutation={TOGGLE_SWITCH_MUTATION}
                                      variables={{
                                        classId: id,
                                        filterName: name,
                                        filterType: metaData.type
                                      }}
                                    >
                                      {filterMutation => {
                                        switch (metaData.type) {
                                          case 'string':
                                            return (
                                              <FilterTextSearch
                                                {...defaultFilterProps}
                                                items={metaData.topOccurrences}
                                                name={name}
                                              />
                                            );
                                          case 'number':
                                            return (
                                              <RangeSlider
                                                filterMutation={filterMutation}
                                                filterValue={filterValue}
                                                min={metaData.lowest}
                                                max={metaData.highest}
                                              />
                                            );

                                          case 'boolean':
                                            return (
                                              <ToggleSwitch
                                                {...defaultFilterProps}
                                                label={name}
                                              />
                                            );
                                          case 'cref':
                                            return (
                                              <Filter
                                                classNameAlt={
                                                  metaData.pointingTo[0]
                                                }
                                                name={'name'}
                                                typename={`Meta${
                                                  metaData.pointingTo[0]
                                                }nameObj`}
                                              />
                                            );
                                          default:
                                            return 'Unknown filter type';
                                        }
                                      }}
                                    </ToggleSwitchMutation>
                                  );
                                }}
                              </Query>
                            );
                          }}
                        </Query>
                      );
                    }}
                  </GetSelectedClassForFilterQuery>
                );
              }}
            </GetMetaTypeQuery>
          </Section>
        )}
      </Container>
    );
  }
}

export default Filter;
