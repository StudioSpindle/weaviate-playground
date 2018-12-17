const referFragment = (fragmentKey: string) => `...${fragmentKey}`;

export default (fragments: any) => {
  const fragmentKeys = Object.keys(fragments);

  const localKeys = fragmentKeys.filter(fragmentKey =>
    fragmentKey.startsWith('local')
  );

  const networkKeys = fragmentKeys.filter(
    fragmentKey => !fragmentKey.startsWith('local')
  );

  return `
      query SelectedClassesWithFilters($where: WeaviateLocalGetWhereInpObj) {
        ${
          localKeys.length
            ? `Local {
                ${localKeys.map(referFragment)}
              }`
            : ''
        }
        ${
          networkKeys.length
            ? `Network {
                ${networkKeys.map(referFragment)}
              }`
            : ''
        }
      }
      ${[...localKeys, ...networkKeys]
        .map(fragmentKey => fragments[fragmentKey].queryString)
        .join(' ')}
  `;
};
