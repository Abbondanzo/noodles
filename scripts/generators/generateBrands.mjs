import { brands } from "../shared/rawData.mjs";
import { escapeURL, getRandomInRange } from "../shared/utils.mjs";

const MIN_SUBSCRIBERS = 15;
const MAX_SUBSCRIBERS = 5e5;

/**
 * @typedef Brand
 * @property {string} slug
 * @property {string} name
 * @property {number} subscribers
 */

/** @returns {Object.<string, Brand>} */
export const generateBrands = () => {
  const brandMap = {};
  brands.forEach((brand) => {
    const slug = escapeURL(brand);
    const subscribers = Math.round(
      getRandomInRange(MIN_SUBSCRIBERS, MAX_SUBSCRIBERS)
    );
    brandMap[slug] = {
      slug,
      name: brand,
      subscribers,
    };
  });
  return brandMap;
};
