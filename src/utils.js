/**
 * @returns {Array<Brand>}
 */
const getTopBrands = (context) => {
  const numTopBrands = 4;
  return Object.keys(context.brands)
    .map((brandSlug) => context.brands[brandSlug])
    .sort((a, b) => b.subscribers - a.subscribers)
    .slice(0, numTopBrands);
};

module.exports = {
  getTopBrands,
};
