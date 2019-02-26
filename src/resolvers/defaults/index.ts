const defaultClass = {
  __typename: 'Class',
  classLocation: 'Local',
  classType: 'Things',
  filters: '{}',
  id: null,
  instance: 'Local',
  isSelected: false,
  name: ''
};

const defaults = {
  canvas: {
    __typename: 'Canvas',
    classIds: [],
    hasActiveSourceLinks: false,
    hasActiveTargetLinks: false,
    links: [],
    queryString: '',
    selectedClass: defaultClass,
    selectedClasses: [],
    zoom: 1
  },
  class: defaultClass,
  classes: [],
  classesFilters: {
    __typename: 'classesFilters',
    classLocation: 'Local',
    classType: 'All',
    queryString: ''
  }
};

export default defaults;
