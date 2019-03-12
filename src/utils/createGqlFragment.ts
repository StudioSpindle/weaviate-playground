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
  cleanString(textString: string): string;
}

export default ({
  classLocation,
  className,
  classType,
  cleanString,
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

  // Include regular properties and fragment references for active links
  const propertiesLinks = `
    ${properties}
    ${activeSourceLinks.map(
      link => `${link.value} {
        ...${cleanString(link.target)}
      }`
    )}
  `;

  const fullQuery = `
    ${type} {
      ${isLocal ? '' : `${classLocation} {`}
          ${classType} {
              ${className}${where ? `(where: ${where})` : ''} {
                  ${propertiesLinks}
              }
          }
      ${isLocal ? '' : '}'}
    }
  `;

  // Only classes with active links are included in the query
  if (!hasActiveSourceLinks && !hasActiveTargetLinks) {
    return '';
  }

  // Fragment is included with reference in the source if there are active target links
  return `
    fragment ${reference} on ${
    hasActiveTargetLinks
      ? className
      : isLocal
      ? 'WeaviateLocalObj'
      : 'WeaviateNetworkObj'
  } {
      ${hasActiveTargetLinks ? propertiesLinks : fullQuery}
    }
  `;
};
