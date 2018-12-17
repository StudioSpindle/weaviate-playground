import { IWeaviateLocalGetWhereInpObj } from 'src/types';

export interface ICreateGqlGetProps {
  classLocation: string;
  className: string;
  classType: string;
  properties: string;
  reference?: string;
  type: 'Get' | 'GetMeta';
  where?: IWeaviateLocalGetWhereInpObj;
}

export default ({
  classLocation,
  className,
  classType,
  properties,
  reference,
  type,
  where
}: ICreateGqlGetProps) => {
  const isLocal = classLocation === 'local' || classLocation === 'Local';
  const isGet = type === 'Get';
  let whereInpObjType = 'WeaviateLocalGetWhereInpObj';

  if (isLocal) {
    if (!isGet) {
      whereInpObjType = 'WeaviateLocalGetMetaWhereInpObj';
    }
  } else {
    if (isGet) {
      whereInpObjType = 'WeaviateNetworkGetWhereInpObj';
    } else {
      whereInpObjType = 'WeaviateNetworkGetMetaWhereInpObj';
    }
  }

  return `
    query ${reference || 'Get'}($where: ${whereInpObjType}) {
      ${isLocal ? 'Local' : 'Network'} {
          ${type}(where: $where) {
            ${isLocal ? '' : `${classLocation} {`}
              ${classType} {
                ${className} {
                  ${properties}
                }
              }
            ${isLocal ? '' : '}'}
          }
        }
    }
  `;
};
