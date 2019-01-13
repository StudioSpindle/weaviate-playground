import { createStyles, WithStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import get from 'get-value';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import {
  Filter as FilterWithStyles,
  FilterTextSearch,
  RangeSlider,
  ToggleSwitch
} from 'src/components';
import { META_TYPE_QUERY, MetaTypeQuery } from 'src/components/filters/queries';
import {
  FILTER_TOGGLE_SWITCH_MUTATION,
  FilterToggleSwitchMutation
} from 'src/components/filterToggleSwitch/queries';
import translations from 'src/translations/en';
import { createGqlGet, unCamelCase } from 'src/utils';
import {
  CLASS_FILTERS_QUERY,
  ClassFiltersQuery,
  SELECTED_CLASS_FOR_FILTER_QUERY,
  SelectedClassForFilterQuery
} from './queries';

/**
 * Types
 */
export interface IFilterProps extends WithStyles<typeof styles> {
  classNameAlt?: string;
  name: string;
  typename: string;
}

export interface IDefaultFilterProps {
  classId: string;
  filterName: string;
  filterType: string;
  filterValue: string | boolean | object;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    details: {
      padding: 0
    },
    root: {
      width: '100%'
    },
    text: {
      '&:first-letter': {
        textTransform: 'uppercase'
      },
      fontSize: '1rem'
    }
  });

const getTypename = (parentTypename: string, fieldName: string) =>
  parentTypename.replace(
    'Obj',
    `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Obj`
  );

const createProperties = (parentTypename: string, fields: any[]) => {
  if (!fields) {
    return '__typename';
  }

  return fields
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
};

/**
 * Filter component: dynamically fetches filter specs and renders filter
 */
class Filter extends React.Component<IFilterProps> {
  public render() {
    const { classes, classNameAlt, name, typename } = this.props;

    return (
      <ExpansionPanel classes={{ root: classes.root }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.text}>{unCamelCase(name)}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.details }}>
          <MetaTypeQuery query={META_TYPE_QUERY} variables={{ typename }}>
            {metaTypeQuery => {
              if (metaTypeQuery.loading) {
                return 'Loading...';
              }

              if (metaTypeQuery.error) {
                return (
                  <Typography color="error">
                    {metaTypeQuery.error.message}
                  </Typography>
                );
              }

              return (
                <SelectedClassForFilterQuery
                  query={SELECTED_CLASS_FOR_FILTER_QUERY}
                >
                  {selectedClassQuery => {
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

                    if (!selectedClassQuery.data || !metaTypeQuery.data) {
                      return (
                        <Typography color="error">
                          1{translations.defaultError}
                        </Typography>
                      );
                    }

                    /**
                     * Create a query string from meta type
                     */
                    const {
                      id,
                      classLocation,
                      classType,
                      instance
                    } = selectedClassQuery.data.canvas.selectedClass;
                    const className =
                      classNameAlt ||
                      selectedClassQuery.data.canvas.selectedClass.name;

                    const fields = get(metaTypeQuery, 'data.__type.fields');

                    const properties = createProperties(typename, fields);

                    const queryString = createGqlGet({
                      className,
                      classType,
                      instance,
                      properties: `${name} { ${properties} }`,
                      reference: 'MetaDataForFilter',
                      type: 'GetMeta'
                    });

                    const FILTER_META_QUERY = gql(queryString);

                    return (
                      <Query query={FILTER_META_QUERY}>
                        {filterMetaQuery => {
                          /**
                           * Get meta data for filter
                           */
                          if (filterMetaQuery.loading) {
                            return 'Loading...';
                          }

                          if (filterMetaQuery.error) {
                            return (
                              <ExpansionPanelSummary>
                                <Typography color="error">
                                  {filterMetaQuery.error.message}
                                </Typography>
                              </ExpansionPanelSummary>
                            );
                          }

                          if (!filterMetaQuery.data) {
                            return (
                              <ExpansionPanelSummary>
                                <Typography color="error">
                                  {translations.defaultError}
                                </Typography>
                              </ExpansionPanelSummary>
                            );
                          }

                          const metaData = get(
                            filterMetaQuery,
                            `data.${classLocation}.GetMeta.${
                              instance === 'Local' ? '' : `${instance}.`
                            }${classType}.${className}.${name}`
                          );

                          return (
                            <ClassFiltersQuery
                              query={CLASS_FILTERS_QUERY}
                              variables={{ id }}
                            >
                              {classFiltersQuery => {
                                /**
                                 * Get meta data for filter
                                 */
                                if (classFiltersQuery.loading) {
                                  return 'Loading...';
                                }

                                if (classFiltersQuery.error) {
                                  return (
                                    <Typography color="error">
                                      {classFiltersQuery.error.message}
                                    </Typography>
                                  );
                                }

                                if (!classFiltersQuery.data || !metaData) {
                                  return (
                                    <Typography color="error">
                                      {translations.defaultError}
                                    </Typography>
                                  );
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
                                  <FilterToggleSwitchMutation
                                    mutation={FILTER_TOGGLE_SWITCH_MUTATION}
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
                                            <FilterWithStyles
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
                                          return (
                                            <ExpansionPanelSummary>
                                              <Typography color="error">
                                                Unknown filter type{' '}
                                                {metaData.type}
                                              </Typography>
                                            </ExpansionPanelSummary>
                                          );
                                      }
                                    }}
                                  </FilterToggleSwitchMutation>
                                );
                              }}
                            </ClassFiltersQuery>
                          );
                        }}
                      </Query>
                    );
                  }}
                </SelectedClassForFilterQuery>
              );
            }}
          </MetaTypeQuery>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(Filter);
