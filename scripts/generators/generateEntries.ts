import { photos, titles } from "../shared/rawData";
import { createArrayGenerator, escapeURL, getRandom } from "../shared/utils";
import { generateStats } from "./generateStats";

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

const titleToSlug = (title: string) => {
  const spaceCheckIndex = 32;
  const firstSpaceIndex = title.indexOf(" ", spaceCheckIndex);
  if (firstSpaceIndex === -1) {
    return escapeURL(title);
  } else {
    return escapeURL(title.slice(0, firstSpaceIndex));
  }
};

export const generateEntries = (
  brandSlugs: string[],
  categorySlugs: string[]
) => {
  const brandsGenerator = createArrayGenerator(brandSlugs);

  const output: { [key: string]: Entry } = {};

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

    const picture: Picture = {
      invert: getRandom() <= CHANCE_TO_INVERT_PICTURE,
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
