export type WhereOperatorEnum =
  | 'And'
  | 'Or'
  | 'Equal'
  | 'Not'
  | 'NotEqual'
  | 'GreaterThan'
  | 'GreaterThanEqual'
  | 'LessThan'
  | 'LessThanEqual';

export interface IWhereOperandsInpObj {
  operator: WhereOperatorEnum;
  operands: IWhereOperandsInpObj[];
  path?: string[];
  valueInt?: number;
  valueNumter?: number;
  valueBoolean?: boolean;
  valueString?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IWeaviateLocalGetWhereInpObj extends IWhereOperandsInpObj {}

// tslint:disable-next-line:no-empty-interface
export interface IWeaviateLocalGetMetaWhereInpObj
  extends IWhereOperandsInpObj {}
