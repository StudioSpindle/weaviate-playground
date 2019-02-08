declare module '*.png';
declare module '*.jpg';
declare module 'react-d3-graph';
declare module 'rc-slider';
declare module 'react-vis';
declare module 'graphiql';
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
