export type Color =
  | 'white'
  | 'vividPink'
  | 'strongLime'
  | 'indigo'
  | 'olive'
  | 'almostBlack'
  | 'gray';

const colors = {
  almostBlack: {
    default: '#00152b',
    'tint-1': '#122742',
    'tint-2': '#213957',
    'tint-3': '#304a6c',
    'tint-4': '#3d577c',
    'tint-5': '#586d91',
    'tint-6': '#7285a7',
    'tint-7': '#96a7c5',
    'tint-8': '#bacbe5',
    'tint-9': '#e2e9ff'
  },
  almostBlackAnalogous: {
    default: '#002a2b',
    'tint-1': '#103f40',
    'tint-2': '#1e5252',
    'tint-3': '#2c6665',
    'tint-4': '#367475',
    'tint-5': '#538989',
    'tint-6': '#6e9e9e',
    'tint-7': '#93bbba',
    'tint-8': '#b7d8d6',
    'tint-9': '#d7f2f3'
  },
  almostBlackTriadic: {
    default: '#2b0015',
    'tint-1': '#3b0d1f',
    'tint-2': '#4b1728',
    'tint-3': '#5a2132',
    'tint-4': '#662839',
    'tint-5': '#7e4653',
    'tint-6': '#97646e',
    'tint-7': '#ba8e97',
    'tint-8': '#dfb8be',
    'tint-9': '#ffdfe0'
  },
  gray: {
    default: '#2b2b2b',
    gray1: '#2b2b2b',
    gray2: '#5e5e5e',
    gray3: '#848484',
    gray4: '#ababab',
    gray5: '#d1d1d1',
    gray6: '#eaeaea',
    gray7: '#f7f7f7'
  },
  indigo: {
    default: '#0070e6',
    'tint-1': '#4c88ee',
    'tint-2': '#77a4f9',
    'tint-3': '#a5c5ff',
    'tint-4': '#d5eaff',
    'tint-5': '#eff7ff',
    tint1: '#0067dc',
    tint2: '#005dcf',
    tint3: '#0053c3',
    tint4: '#003eac'
  },
  info: {
    bg: '#fffce5',
    default: '#fce81c'
  },
  mark: {
    default: '#f3fb01'
  },
  olive: {
    default: '#b0a002',
    'tint-1': '#c4b223',
    'tint-2': '#d9c539',
    'tint-3': '#ead77c',
    'tint-4': '#f7ebbd',
    'tint-5': '#fff9d2',
    tint1: '#af8d00',
    tint2: '#a97d00',
    tint3: '#a76a00',
    tint4: '#aa5300'
  },
  oliveAnalogous: {
    default: '#b04802',
    'tint-1': '#c95406',
    'tint-2': '#d65b09',
    'tint-3': '#e4630e',
    'tint-4': '#ee6912',
    'tint-5': '#f17c3b',
    'tint-6': '#f39260',
    'tint-7': '#f7b08e',
    'tint-8': '#faceba',
    'tint-9': '#f9eae6'
  },
  oliveTriadic: {
    default: '#005744',
    'tint-1': '#007360',
    'tint-2': '#00836f',
    'tint-3': '#009480',
    'tint-4': '#00a18d',
    'tint-5': '#02b09f',
    'tint-6': '#45bfb0',
    'tint-7': '#7ed2c7',
    'tint-8': '#b2e3dd',
    'tint-9': '#e0f4f2'
  },
  strongLime: {
    default: '#38d611',
    'tint-1': '#6bdf4a',
    'tint-2': '#97e87b',
    'tint-3': '#bcf0a7',
    'tint-4': '#def8d3',
    'tint-5': '#e8ffdd',
    tint1: '#1ec600',
    tint2: '#00b800',
    tint3: '#00aa00',
    tint4: '#009c00'
  },
  success: {
    bg: '#e7ffeb',
    default: '#01cc26'
  },
  vividPink: {
    default: '#fa0171',
    'tint-1': '#fc3988',
    'tint-2': '#ff5fa0',
    'tint-3': '#ff90bd',
    'tint-4': '#ffbddc',
    'tint-5': '#ffe7f7',
    tint1: '#e7006b',
    tint2: '#d20268',
    tint3: '#bc0063',
    tint4: '#95025c'
  },
  warning: {
    bg: '#ffe8e7',
    default: '#ff1101'
  },
  white: {
    default: '#fff'
  }
};

export default (color: Color, variant?: string): string => {
  return variant && colors[color][variant]
    ? colors[color][variant]
    : colors[color].default;
};
