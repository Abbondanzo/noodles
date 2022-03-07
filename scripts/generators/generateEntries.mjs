import { photos, titles } from "../shared/rawData.mjs";
import {
  createArrayGenerator,
  escapeURL,
  getRandom,
} from "../shared/utils.mjs";
import { generateStats } from "./generateStats.mjs";

const CHANCE_TO_INVERT_PICTURE = 0.3;
const MIN_CATEGORY_COUNT = 2;
const MAX_CATEGORY_COUNT = 5;

/**
 * @typedef Picture
 * @property {string} fileName
 * @property {boolean} invert
 */

/**
 * @typedef {Object} Entry
 * @property {string} title
 * @property {string} slug
 * @property {string} brandSlug
 * @property {Array<string>} categorySlugs
 * @property {Stats} stats
 * @property {Picture} picture
 */

const photoGenerator = createArrayGenerator(photos);

/**
 * @param {string} title
 * @returns {string}
 */
const titleToSlug = (title) => {
  const spaceCheckIndex = 32;
  const firstSpaceIndex = title.indexOf(" ", spaceCheckIndex);
  if (firstSpaceIndex === -1) {
    return escapeURL(title);
  } else {
    return escapeURL(title.slice(0, firstSpaceIndex));
  }
};

/**
 * @param {Array<string>} brandSlugs
 * @param {Array<string>} categorySlugs
 * @returns {Object.<string, Entry>}
 */
export const generateEntries = (brandSlugs, categorySlugs) => {
  const brandsGenerator = createArrayGenerator(brandSlugs);

  /**
   * @type {Object.<string, Entry>}
   */
  const output = {};

  titles.forEach((title) => {
    // Always include categories that are mentioned in the title
    const titleCategories = categorySlugs.filter((category) =>
      title.toLowerCase().includes(category.toLowerCase())
    );
    const minCategoriesToAdd =
      Math.floor(getRandom() * (MAX_CATEGORY_COUNT - MIN_CATEGORY_COUNT)) +
      MIN_CATEGORY_COUNT;
    while (titleCategories.length < minCategoriesToAdd) {
      if (minCategoriesToAdd > categorySlugs.length) {
        break;
      }
      // O(n^2) because I like exponential numbers
      const remainingCategories = categorySlugs.filter(
        (category) => !titleCategories.includes(category)
      );
      const remainingCategoryIndex = Math.floor(
        getRandom() * remainingCategories.length
      );
      titleCategories.push(remainingCategories[remainingCategoryIndex]);
    }

    const invert = getRandom() <= CHANCE_TO_INVERT_PICTURE;
    /** @type {Picture} */
    const picture = {
      invert,
      fileName: photoGenerator.next().value,
    };

    const slug = titleToSlug(title);

    output[slug] = {
      title,
      slug,
      brandSlug: brandsGenerator.next().value,
      categorySlugs: titleCategories,
      stats: generateStats(),
      picture,
    };
  });

  return output;
};
