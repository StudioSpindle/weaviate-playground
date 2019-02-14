import { IGraphLinks } from 'src/components/graph/types';

export interface ICreateGqlGetProps {
  classLocation: string;
  className: string;
  classType: string;
  id: string;
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
  hasParent,
  id,
  links,
  properties,
  type,
  where
}: ICreateGqlGetProps) => {
  const isLocal = classLocation === 'local' || classLocation === 'Local';
  const activeSourceLinks = links.filter(
    link => link.source === id && link.isActive
  );
  const activeTargetLinks = links.filter(
    link => link.target === id && link.isActive
  );
  const hasActiveSourceLinks = Boolean(activeSourceLinks.length);
  const hasActiveTargetLinks = Boolean(activeTargetLinks.length);
  const reference = cleanString(id);

  const fullQuery = `
    ${type} {
      ${isLocal ? '' : `${classLocation} {`}
          ${classType} {
              ${className}${where ? `(where: ${where})` : ''} {
                  ${properties}
                  ${activeSourceLinks.map(
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

  if (!hasActiveSourceLinks && !hasActiveTargetLinks) {
    return '';
  }

  return `
    fragment ${reference} on ${
    hasParent && hasActiveTargetLinks
      ? className
      : isLocal
      ? 'WeaviateLocalObj'
      : 'WeaviateNetworkObj'
  } {
      ${hasParent && hasActiveTargetLinks ? properties : fullQuery}
    }
  `;
};
