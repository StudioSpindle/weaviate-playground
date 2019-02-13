import { IGraphLinks } from 'src/components/graph/types';

export interface ICreateGqlGetProps {
  classLocation: string;
  className: string;
  classType: string;
  links: IGraphLinks;
  properties: string;
  reference?: string;
  type: 'Get' | 'GetMeta';
  where?: string;
  hasParent?: boolean;
  cleanString(textString: string): string;
}

export default ({
  classLocation,
  className,
  classType,
  cleanString,
  links,
  properties,
  reference,
  type,
  where,
  hasParent
}: ICreateGqlGetProps) => {
  const isLocal = classLocation === 'local' || classLocation === 'Local';
  const activeLinks = links.filter(link => link.isActive);
  const hasActiveLinks = Boolean(activeLinks.length);

  const fullQuery = `
    ${type} {
      ${isLocal ? '' : `${classLocation} {`}
          ${classType} {
              ${className}${where ? `(where: ${where})` : ''} {
                  ${properties}
                  ${activeLinks.map(
                    link => `
                    ${link.value} {
                      ...${cleanString(link.target)}
                    }
                  `
                  )}
              }
          }
      ${isLocal ? '' : '}'}
    }
  `;

  // tslint:disable-next-line:no-console
  console.log(hasActiveLinks);

  return `
    fragment ${reference} on ${
    hasParent && hasActiveLinks
      ? className
      : isLocal
      ? 'WeaviateLocalObj'
      : 'WeaviateNetworkObj'
  } {
      ${hasParent && hasActiveLinks ? properties : fullQuery}
    }
  `;
};
