import { TextComponent } from 'src/components/text/Text';
import getBreakpoint from 'src/utils/getBreakpoint';

export interface ITextSize {
  mobile: string;
  tablet: string;
}

export interface ITextSizes {
  [index: string]: ITextSize;
}

export const textSizes: ITextSizes = {
  h1: {
    mobile: '2rem',
    tablet: '2.185rem'
  },
  h2: {
    mobile: '1.75rem',
    tablet: '1.875rem'
  },
  h3: {
    mobile: '1.5rem',
    tablet: '1.5rem'
  },
  h4: {
    mobile: '1.25rem',
    tablet: '1.35rem'
  },
  h5: {
    mobile: '1rem',
    tablet: '1.25rem'
  },
  h6: {
    mobile: '2rem',
    tablet: '1.25rem'
  },
  p: {
    mobile: '1.15rem',
    tablet: '1.25rem'
  },
  span: {
    mobile: '1.15rem',
    tablet: '1.25rem'
  }
};

export default (component?: TextComponent): string => {
  const Component = component || 'span';
  return `
    font-size: ${textSizes[Component].mobile};
    @media (max-width: ${getBreakpoint('tablet')}em) {
        font-size: ${textSizes[Component].tablet};
    }`;
};
