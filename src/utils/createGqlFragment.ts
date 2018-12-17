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
  type
}: ICreateGqlGetProps) => {
  const isLocal = classLocation === 'local' || classLocation === 'Local';

  return `
    fragment ${reference} on ${
    isLocal ? 'WeaviateLocalObj' : 'WeaviateNetworkObj'
  } {
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
  `;
};

//   `
//     fragment ${cleanClassId} on ${
//     isLocal ? 'WeaviateLocalObj' : 'WeaviateNetworkObj'
//   } {
//       ${isLocal ? '' : `${instance} {`}
//         Get(where: $where) {
//           ${classType} {
//             ${name} {
//               uuid
//               name
//             }
//           }
//         }
//       ${isLocal ? '' : '}'}
//     }
//   `;
