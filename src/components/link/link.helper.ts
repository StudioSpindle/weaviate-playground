const buildLinkPathDefinition = ({
  source,
  target
}: {
  source: { x: number; y: number };
  target: { x: number; y: number };
}): string => {
  const { x: sx, y: sy } = source;
  const { x: tx, y: ty } = target;
  const midy = Number((ty - sy) / 2) + Number(sy);
  const midx = Number((tx - sx) / 2) + Number(sx);

  return `M${sx},${sy}L${midx},${midy},${tx},${ty}`;
};

export { buildLinkPathDefinition };
