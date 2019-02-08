import { HIGHLIGHTED, MARKERS, SIZES } from './marker.const';

const markerKeyBuilder = (size: string, highlighted: string): string =>
  `MARKER_${size}${highlighted}`;

const getMarkerSize = (
  transform: number,
  mMax: number,
  lMax: number
): string => {
  if (transform < mMax) {
    return SIZES.S;
  } else if (transform >= mMax && transform < lMax) {
    return SIZES.M;
  } else {
    return SIZES.L;
  }
};

const computeMarkerId = (
  highlight: boolean,
  transform: number,
  { maxZoom }: { maxZoom: number }
): string => {
  const mMax = maxZoom / 4;
  const lMax = maxZoom / 2;
  const size = getMarkerSize(transform, mMax, lMax);
  const highlighted = highlight ? HIGHLIGHTED : '';
  const markerKey = markerKeyBuilder(size, highlighted);

  return MARKERS[markerKey];
};

/**
 * This function memoize results for _computeMarkerId
 * since many of the times user will be playing around with the same zoom
 * factor, we can take advantage of this and cache the results for a
 * given combination of highlight state, zoom transform value and maxZoom config.
 */
const memoizedComputeMarkerId = (): any => {
  const cache = {};

  return (
    highlight: boolean,
    transform: number,
    { maxZoom }: { maxZoom: number }
  ) => {
    const cacheKey = `${highlight};${transform};${maxZoom}`;

    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    const markerId = computeMarkerId(highlight, transform, { maxZoom });

    cache[cacheKey] = markerId;

    return markerId;
  };
};

/**
 * Memoized reference for _memoizedComputeMarkerId exposed
 * as getter for sake of readability.
 * Gets proper marker id given the highlight state and the zoom
 * transform.
 */
const getMarkerId = memoizedComputeMarkerId();

export { getMarkerId };
