import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { Text } from 'src/components';
import {
  GET_META_TYPE,
  GetMetaTypeQuery
} from 'src/components/filters/queries';
import { unCamelCase } from 'src/utils';
import styled from 'styled-components';

/**
 * Types
 */
export interface IFilterProps {
  name: string;
  typename: string;
}

export interface IFilterState {
  isOpen: boolean;
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
      if (field.type.name) {
        return `${field.name}`;
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
    const { name, typename } = this.props;
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

                if (!metaTypeQuery.data) {
                  // TODO: Replace with proper message
                  return null;
                }

                /**
                 * Create a query string from meta type
                 */
                const queryString = createQueryString(
                  typename,
                  metaTypeQuery.data.__type.fields
                );

                const qs = `
                query MetaDataForFilter {
                Local {
                  GetMeta {
                    Things {
                      City {
                        ${name} {
                          ${queryString}
                        }
    
                      }
                    }
                  }
                }
              }`;
                const query = gql(qs);

                // tslint:disable-next-line:no-console
                console.log(qs);

                return (
                  <Query query={query}>
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

                      // tslint:disable-next-line:no-console
                      console.log(filterMetaQuery);

                      return <p>Filter</p>;
                    }}
                  </Query>
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
