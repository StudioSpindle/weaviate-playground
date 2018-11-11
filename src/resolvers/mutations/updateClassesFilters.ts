import { IUpdateClassesFiltersVariables } from 'src/components/library/queries';
import defaults from 'src/resolvers/defaults';

const updateClassesFilters = (
  _: any,
  variables: IUpdateClassesFiltersVariables,
  { cache, getCacheKey }: { cache: any; getCacheKey: any }
) => {
  const id = getCacheKey({
    __typename: defaults.classesFilters.__typename
  });
  let data = {};
  if (variables.classLocation) {
    data = { ...data, classLocation: variables.classLocation };
  }
  if (variables.classType) {
    data = { ...data, classType: variables.classType };
  }
  if (typeof variables.queryString !== 'undefined') {
    data = { ...data, queryString: variables.queryString };
  }

  cache.writeData({ id, data });
  return null;
};

export default updateClassesFilters;
