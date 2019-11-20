export interface ICreateGqlGetProps {
  instance: string;
  className: string;
  classType: string;
  properties: string;
  reference?: string;
  type: 'Get' | 'Aggregate';
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
  return `
    query ${reference || 'Get'} {
      ${type} {
          ${classType} {
            ${className} ${where ? `(where: ${where})` : ''}{
              ${properties}
          }
        }
      }
    }
  `;
};
