import { IFragment } from 'src/components/resultsContainer/ResultsContainer';

const referFragment = (fragmentKey: string) => `...${fragmentKey}`;

export default (fragments: { [key: string]: IFragment }) => {
  const fragmentKeys = Object.keys(fragments);
  const withoutActiveParent = (fragmentKey: string) => {
    return (
      fragments[fragmentKey].hasActiveSourceLinks &&
      !fragments[fragmentKey].hasActiveTargetLinks
    );
  };

  const localKeys = fragmentKeys.filter(
    fragmentKey =>
      fragmentKey.startsWith('local') &&
      fragments[fragmentKey].queryString !== ''
  );

  const networkKeys = fragmentKeys.filter(
    fragmentKey =>
      !fragmentKey.startsWith('local') &&
      fragments[fragmentKey].queryString !== ''
  );

  const allKeys = [...localKeys, ...networkKeys];

  const queryString = `
  query SelectedClassesWithFilters {
    ${
      localKeys.length
        ? `Local {
            ${localKeys.filter(withoutActiveParent).map(referFragment)}
          }`
        : ''
    }
    ${
      networkKeys.length
        ? `Network {
            ${networkKeys.filter(withoutActiveParent).map(referFragment)}
          }`
        : ''
    }
  }
  ${allKeys.map(fragmentKey => fragments[fragmentKey].queryString).join(' ')}
`;

  const referredFragments: string[] = [];
  queryString.split(' ').forEach(word => {
    if (word.startsWith('...')) {
      const key = word.replace('...', '').replace(/(\r\n|\n|\r)/gm, '');
      referredFragments.push(key);
    }
  });

  const includesFragments = referredFragments.every(fragmentKey =>
    allKeys.includes(fragmentKey)
  );

  const includesReferences = allKeys.every(key =>
    referredFragments.includes(key)
  );

  if (
    (!localKeys.length && !networkKeys.length) ||
    (!includesFragments || !includesReferences)
  ) {
    return '';
  }

  return queryString;
};
