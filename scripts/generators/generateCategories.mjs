import { categories } from "../shared/rawData.mjs";
import { escapeURL } from "../shared/utils.mjs";

/**
 * @typedef Category
 * @property {string} slug
 * @property {string} name
 */

/** @returns {Object.<string, Category>} */
export const generateCategories = () => {
  const categoryMap = {};
  categories.forEach((category) => {
    const slug = escapeURL(category);
    categoryMap[slug] = {
      slug,
      name: category,
    };
  });
  return categoryMap;
};
