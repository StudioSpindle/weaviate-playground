import { Theme } from '@material-ui/core';

export { default as orange } from './orange';
export default './default';

export interface IThemeSpec {
  theme: Theme;
  logo?: string;
}
