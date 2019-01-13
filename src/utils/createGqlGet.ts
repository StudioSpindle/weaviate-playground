export interface ICreateGqlGetProps {
  instance: string;
  className: string;
  classType: string;
  properties: string;
  reference?: string;
  type: 'Get' | 'GetMeta';
  where?: string;
}

export default ({
  className,
  classType,
  instance,
  properties,
  reference,
  type,
  where
}: ICreateGqlGetProps) => {
  const isLocal = instance === 'local' || instance === 'Local';

  return `
    query ${reference || 'Get'} {
      ${isLocal ? 'Local' : 'Network'} {
          ${type} {
            ${isLocal ? '' : `${instance} {`}
              ${classType} {
                ${className} ${where ? `(where: ${where})` : ''}{
                  ${properties}
                }
              }
            ${isLocal ? '' : '}'}
          }
        }
    }
  `;
};
