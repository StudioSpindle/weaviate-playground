/**
 * @module Link/helper
 * @description
 * A set of helper methods to manipulate/create links.
 */

/**
 * This method returns the path definition for a given link base on the line type
 * and the link source and target.
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d|d attribute mdn}
 * @param {Object} link - the link to build the path definition
 * @param {Object} link.source - link source
 * @param {Object} link.target - link target
 * @returns {string} the path definition for the requested link
 * @memberof Link/helper
 */
function buildLinkPathDefinition({ source = {}, target = {} }) {
    const { x: sx, y: sy } = source;
    const { x: tx, y: ty } = target;
    const midy = Number((ty - sy) / 2) + Number(sy);
    const midx = Number((tx - sx) / 2) + Number(sx);

    return `M${sx},${sy}L${midx},${midy},${tx},${ty}`;
}

export { buildLinkPathDefinition };
