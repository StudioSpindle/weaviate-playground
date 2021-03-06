import gql from 'graphql-tag';
import { IFilterToggleSwitchVariables } from 'src/components/filterToggleSwitch/queries';
import defaults from 'src/resolvers/defaults';

const updateClassFilters = (
  _: any,
  variables: IFilterToggleSwitchVariables,
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const classQuery = cache.readQuery({
    query: gql`
      query SelectedClass($id: String!) {
        class(id: $id) @client {
          filters
        }
      }
    `,
    variables: {
      id: variables.classId
    }
  });

  const filtersString = classQuery.class.filters;
  const filters = JSON.parse(filtersString);
  const key = variables.path
    ? JSON.stringify([...variables.path, variables.filterName])
    : variables.filterName;
  let value = filters[key];

  if (variables.filterType === 'string') {
    if (!value) {
      value = [];
    }
    if (value.includes(variables.value)) {
      value = value.filter((val: string) => val !== variables.value);
    } else {
      value = [...value, variables.value];
    }
  } else {
    value = variables.value;
  }

  const id = `${defaults.class.__typename}:${variables.classId}`;

  const data = {
    filters: JSON.stringify({
      ...filters,
      [key]: value
    })
  };

  cache.writeData({ id, data });
  return null;
};

export default updateClassFilters;
