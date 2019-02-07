const referFragment = (fragmentKey: string) => `...${fragmentKey}`;

export default (fragments: any) => {
  const fragmentKeys = Object.keys(fragments);
  const withoutParent = (fragmentKey: string) =>
    !fragments[fragmentKey].hasParent;

  const localKeys = fragmentKeys.filter(fragmentKey =>
    fragmentKey.startsWith('local')
  );

  const networkKeys = fragmentKeys.filter(
    fragmentKey => !fragmentKey.startsWith('local')
  );

  return `
      query SelectedClassesWithFilters {
        ${
          localKeys.length
            ? `Local {
                ${localKeys.filter(withoutParent).map(referFragment)}
              }`
            : ''
        }
        ${
          networkKeys.length
            ? `Network {
                ${networkKeys.filter(withoutParent).map(referFragment)}
              }`
            : ''
        }
      }
      ${[...localKeys, ...networkKeys]
        .map(fragmentKey => fragments[fragmentKey].queryString)
        .join(' ')}
  `;
};
