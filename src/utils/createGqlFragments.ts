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
  const localKeysWithoutActiveParent = localKeys.filter(withoutActiveParent);

  const networkKeys = fragmentKeys.filter(
    fragmentKey =>
      !fragmentKey.startsWith('local') &&
      fragments[fragmentKey].queryString !== ''
  );
  const networkKeysWithoutActiveParent = networkKeys.filter(
    withoutActiveParent
  );

  const allKeys = [...localKeys, ...networkKeys];

  // Only refer to fragments that have no active parent.
  // Other fragments have already been referred to in their active parents.
  // The actual fragments are added at the bottom
  const queryString = `
    query SelectedClassesWithFilters {
      ${
        localKeysWithoutActiveParent.length
          ? `Local {
              ${localKeysWithoutActiveParent.map(referFragment)}
            }`
          : ''
      }
      ${
        networkKeysWithoutActiveParent.length
          ? `Network {
              ${networkKeysWithoutActiveParent.map(referFragment)}
            }`
          : ''
      }
    }
    ${allKeys.map(fragmentKey => fragments[fragmentKey].queryString).join(' ')}
  `;

  // Get a list with all the referred fragments
  const referredFragments: string[] = [];
  queryString.split(' ').forEach(word => {
    if (word.startsWith('...')) {
      const key = word.replace('...', '').replace(/(\r\n|\n|\r)/gm, '');
      referredFragments.push(key);
    }
  });

  // Make sure all fragments are included
  const includesFragments = referredFragments.every(fragmentKey =>
    allKeys.includes(fragmentKey)
  );

  // Make sure all references are included
  const includesReferences = allKeys.every(key =>
    referredFragments.includes(key)
  );

  // Return empty string if queryString is invalid
  if (
    (!localKeys.length && !networkKeys.length) ||
    (!localKeysWithoutActiveParent.length &&
      !networkKeysWithoutActiveParent.length) ||
    (!includesFragments || !includesReferences)
  ) {
    return '';
  }
  return queryString;
};
