/**
 * @module Link/const
 * @description
 * A set of constants that facilitate readability regarding links.
 */
/**
 * @typedef {Object} LINE_TYPES
 * @property {string} STRAIGHT - a straight line.
 * @property {string} CURVE_SMOOTH - a slight curve between two nodes
 * @property {string} CURVE_FULL - a semicircumference trajectory unites source and target nodes.
 * @memberof Link/const
 */
const LINE_TYPES = {
    CURVE_FULL: "CURVE_FULL",
    CURVE_SMOOTH: "CURVE_SMOOTH",
    STRAIGHT: "STRAIGHT",
};

export {
    LINE_TYPES
};