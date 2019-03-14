const buildLinkPathDefinition = ({
  maxSameHalf,
  sameArcDirection,
  sameIndexCorrected,
  sameMiddleLink,
  sameUneven,
  source,
  target
}: {
  maxSameHalf: number;
  sameArcDirection: number;
  sameIndexCorrected: number;
  sameMiddleLink: boolean;
  sameUneven: boolean;
  source: { x: number; y: number };
  target: { x: number; y: number };
}): string => {
  const { x: sx, y: sy } = source;
  const { x: tx, y: ty } = target;
  const midy = Number((ty - sy) / 2) + Number(sy);
  const midx = Number((tx - sx) / 2) + Number(sx);
  const dx = tx - sx;
  const dy = ty - sy;
  const dr = Math.sqrt(dx * dx + dy * dy);
  const unevenCorrection = sameUneven ? 0 : 0.5;
  // Add arc for multiple links
  const arc = (dr * maxSameHalf) / (sameIndexCorrected - unevenCorrection);
  const d = sameMiddleLink
    ? `M${sx},${sy}L${midx},${midy},${tx},${ty}`
    : `M${sx},${sy}A${arc},${arc} 0 0,${sameArcDirection} ${tx},${ty}`;

  return d;
};

export { buildLinkPathDefinition };
