import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { defaults } from 'src/resolvers';
import { getName } from '.';

const dataIdFromObject = (object: any) => {
  const name = getName(object);
  switch (object.__typename) {
    case defaults.canvas.__typename:
    case defaults.classesFilters.__typename:
    case '__Schema':
      return object.__typename;
    case '__Field':
      if (name) {
        return `__Field:${name}`;
      }
      return `__Field:${object.id}`;
    default:
      if (!object.id && !object._id) {
        return object.__typename;
      }
      return defaultDataIdFromObject(object);
  }
};

export default dataIdFromObject;
