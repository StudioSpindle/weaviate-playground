import CONST from '../const';
import CONFIG from '../graph/graph.config';

export default {
  ARC: {
    END_ANGLE: 2 * Math.PI,
    START_ANGLE: 0
  },
  DEFAULT_NODE_SIZE: CONFIG.node.size,
  NODE_LABEL_DX: '.90em',
  NODE_LABEL_DY: '.35em',
  ...CONST
};
