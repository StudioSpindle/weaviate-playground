/**
 * Functions
 */
export const createOperand = (path: string[], value: any, operator: string) => {
  if (typeof value === 'string') {
    return {
      operator,
      path,
      valueString: value
    };
  } else if (typeof value === 'number') {
    return {
      operator,
      path,
      valueInt: value
    };
  } else if (typeof value === 'boolean' && value === true) {
    return {
      operator,
      path,
      valueBoolean: value
    };
  }
  return null;
};

export default (path: string[], filters: any) => {
  const keys = Object.keys(filters);
  let operands: any[] = [];
  if (keys.length) {
    keys.map(key => {
      const filter = filters[key];
      const newPath = [...path, key];
      let operator = 'Equal';

      if (Array.isArray(filter)) {
        if (typeof filter[0] === 'string') {
          operands.push({
            operands: filter.map(filterItem => {
              return createOperand(newPath, filterItem, operator);
            }),
            operator: 'Or'
          });
        } else if (typeof filter[0] === 'number') {
          operands.push({
            operands: filter.map((filterItem, i) => {
              operator = i === 0 ? 'GreaterThanEqual' : 'LessThanEqual';
              return createOperand(newPath, filterItem, operator);
            }),
            operator: 'And'
          });
        }
      } else {
        operands.push(createOperand(newPath, filter, operator));
      }
    });

    operands = operands.filter(Boolean);

    if (operands.length === 0) {
      return null;
    }

    return {
      operands,
      operator: 'And'
    };
  }
  return null;
};
