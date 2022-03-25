import { brands, photos } from "../shared/rawData.mjs";
import {
  createArrayGenerator,
  escapeURL,
  getRandom,
  getRandomInRange,
} from "../shared/utils.mjs";

const CHANCE_TO_INVERT_PICTURE = 0.3;
const MIN_SUBSCRIBERS = 15;
const MAX_SUBSCRIBERS = 5e5;

/**
 * @typedef Picture
 * @property {string} fileName
 * @property {boolean} invert
 */

/**
 * @typedef Brand
 * @property {string} slug
 * @property {string} name
 * @property {number} subscribers
 * @property {Picture} picture
 */

const photoGenerator = createArrayGenerator(photos);

/** @returns {Object.<string, Brand>} */
export const generateBrands = () => {
  const brandMap = {};
  brands.forEach((brand) => {
    const slug = escapeURL(brand);
    const subscribers = Math.round(
      getRandomInRange(MIN_SUBSCRIBERS, MAX_SUBSCRIBERS)
    );
    /** @type {Picture} */
    const picture = {
      invert: getRandom() <= CHANCE_TO_INVERT_PICTURE,
      fileName: photoGenerator.next().value,
    };
    brandMap[slug] = {
      slug,
      name: brand,
      picture,
      subscribers,
    };
  });
  return brandMap;
};
