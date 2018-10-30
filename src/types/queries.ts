import { ClassLocation, ClassType } from 'src/types';

export interface IClassesQueryVariables {
  classLocation: ClassLocation;
  classType?: ClassType;
  queryString: string;
}
