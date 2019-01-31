/**
 * Some of the properties have a major performance impact when toggled while rendering graphs of medium or large dimensions (hundreds or thousand of elements).
 * These properties are marked with 🚅🚅🚅.
 * ⭐ **tip** *to achieve smoother interactions you may want to provide a toggle to set **staticGraph** to **true** *
 */
export default {
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  d3: {
    alphaTarget: 0.05,
    gravity: -100,
    linkLength: 100,
    linkStrength: 1
  },
  directed: false,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  height: 400,
  highlightDegree: 1,
  highlightOpacity: 1,
  link: {
    color: '#d3d3d3',
    highlightColor: '#d3d3d3',
    mouseCursor: 'pointer',
    opacity: 1,
    semanticStrokeWidth: false,
    strokeWidth: 1.5,
    type: 'STRAIGHT'
  },
  linkHighlightBehavior: false,
  maxZoom: 8,
  minZoom: 0.1,
  node: {
    color: '#d3d3d3',
    fontColor: 'black',
    fontSize: 8,
    fontWeight: 'normal',
    highlightColor: 'SAME',
    highlightFontSize: 8,
    highlightFontWeight: 'normal',
    highlightStrokeColor: 'SAME',
    highlightStrokeWidth: 1.5,
    labelProperty: 'id',
    mouseCursor: 'pointer',
    opacity: 1,
    renderLabel: true,
    size: 200,
    strokeColor: 'none',
    strokeWidth: 1.5,
    svg: '',
    symbolType: 'circle',
    viewGenerator: null
  },
  nodeHighlightBehavior: false,
  panAndZoom: false,
  staticGraph: false,
  width: 800
};
