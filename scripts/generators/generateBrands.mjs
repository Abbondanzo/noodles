import { brands } from "../shared/rawData.mjs";
import { escapeURL } from "../shared/utils.mjs";

/**
 * @typedef Brand
 * @property {string} slug
 * @property {string} name
 */

/** @returns {Object.<string, Brand>} */
export const generateBrands = () => {
  const brandMap = {};
  brands.forEach((brand) => {
    const slug = escapeURL(brand);
    brandMap[slug] = {
      slug,
      name: brand,
    };
  });
  return brandMap;
};
