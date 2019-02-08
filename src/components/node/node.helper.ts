import {
  symbol as d3Symbol,
  symbolCircle as d3SymbolCircle,
  symbolCross as d3SymbolCross,
  symbolDiamond as d3SymbolDiamond,
  symbolSquare as d3SymbolSquare,
  symbolStar as d3SymbolStar,
  symbolTriangle as d3SymbolTriangle,
  symbolWye as d3SymbolWye
} from 'd3-shape';
import CONST from './node.const';

const convertTypeToD3Symbol = (typeName: string): { draw: any } => {
  switch (typeName) {
    case CONST.SYMBOLS.CIRCLE:
      return d3SymbolCircle;
    case CONST.SYMBOLS.CROSS:
      return d3SymbolCross;
    case CONST.SYMBOLS.DIAMOND:
      return d3SymbolDiamond;
    case CONST.SYMBOLS.SQUARE:
      return d3SymbolSquare;
    case CONST.SYMBOLS.STAR:
      return d3SymbolStar;
    case CONST.SYMBOLS.TRIANGLE:
      return d3SymbolTriangle;
    case CONST.SYMBOLS.WYE:
      return d3SymbolWye;
    default:
      return d3SymbolCircle;
  }
};

const buildSvgSymbol = (
  size: number = CONST.DEFAULT_NODE_SIZE,
  symbolTypeDesc: string = CONST.SYMBOLS.CIRCLE
): string | undefined =>
  d3Symbol()
    .size(() => size)
    .type(() => convertTypeToD3Symbol(symbolTypeDesc))() || undefined;

export default {
  buildSvgSymbol
};
