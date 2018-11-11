import toggleClassSelectionLibrary from 'src/resolvers/mutations/toggleClassSelectionLibrary';
import updateClass from 'src/resolvers/mutations/updateClass';
import updateClassesFilters from 'src/resolvers/mutations/updateClassesFilters';
import updateClassFilters from 'src/resolvers/mutations/updateClassFilters';
import updateClassSelectionCanvas from 'src/resolvers/mutations/updateClassSelectionCanvas';
import updateSelectedClasses from 'src/resolvers/mutations/updateSelectedClasses';

export { default as defaults } from 'src/resolvers/defaults';

export const resolvers = {
  Mutation: {
    toggleClassSelectionLibrary,
    updateClass,
    updateClassFilters,
    updateClassSelectionCanvas,
    updateClassesFilters,
    updateSelectedClasses
  }
};
