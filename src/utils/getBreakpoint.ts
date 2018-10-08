export type Breakpoint = 'tablet' | 'desktop';
export type Value = 'em' | 'px';

export const breakpoints = {
  desktop: {
    em: 61.1875,
    px: 979
  },
  tablet: {
    em: 48,
    px: 768
  }
};

export default (breakpoint: Breakpoint, value?: Value): number =>
  value ? breakpoints[breakpoint][value] : breakpoints[breakpoint].em;
