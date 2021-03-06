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
    if (value % 1 === 0) {
      return {
        operator,
        path,
        valueInt: Number(value.toFixed())
      };
    } else {
      return {
        operator,
        path,
        valueNumber: value
      };
    }
  } else if (typeof value === 'boolean' && value === true) {
    return {
      operator,
      path,
      valueBoolean: value
    };
  }
  return null;
};

export default (filters: any) => {
  const keys = Object.keys(filters);
  let operands: any[] = [];
  if (keys.length) {
    keys.map(key => {
      const filter = filters[key];
      // Key with '[' is an stringified array with a path for a nested filter
      const newPath = key.includes('[') ? JSON.parse(key) : [key];
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
      return undefined;
    }

    const obj = {
      operands,
      operator: 'And'
    };

    const filterString = JSON.stringify(obj);

    return filterString
      .replace(/\"([^(\")"]+)\":/g, '$1:')
      .replace(new RegExp('"GreaterThanEqual"', 'g'), 'GreaterThanEqual')
      .replace(new RegExp('"LessThanEqual"', 'g'), 'LessThanEqual')
      .replace(new RegExp('"Equal"', 'g'), 'Equal')
      .replace(new RegExp('"And"', 'g'), 'And')
      .replace(new RegExp('"Or"', 'g'), 'Or');
  }

  return undefined;
};
