import { createArrayGenerator } from "../shared/utils.mjs";

const NUM_BRANDS = 4;

/**
 * @typedef {Object} TopBrands
 * @property {string} title
 * @property {Array<string>} brands
 */

/**
 * @param {Array<string>} brandIds
 * @returns {Array<TopBrands>}
 */
export const generateTopBrands = (brandIds) => {
  const brandIdGenerator = createArrayGenerator(brandIds);
  const topBrandIds = [];
  let numEntriesToAdd = NUM_BRANDS;
  while (numEntriesToAdd > 0) {
    const brandId = brandIdGenerator.next().value;
    topBrandIds.push(brandId);
    numEntriesToAdd--;
  }
  return topBrandIds;
};
