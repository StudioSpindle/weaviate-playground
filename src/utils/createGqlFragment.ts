export interface ICreateGqlGetProps {
  classLocation: string;
  className: string;
  classType: string;
  properties: string;
  reference?: string;
  type: 'Get' | 'GetMeta';
  where?: string;
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

  return `
    fragment ${reference} on ${
    isLocal ? 'WeaviateLocalObj' : 'WeaviateNetworkObj'
  } {
    ${type} {
        ${isLocal ? '' : `${classLocation} {`}
            ${classType} {
                ${className}${where ? `(where: ${where})` : ''} {
                    ${properties}
                }
            }
        ${isLocal ? '' : '}'}
        }
    }
  `;
};
