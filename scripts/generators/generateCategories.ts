import { categories } from "../shared/rawData";
import { escapeURL } from "../shared/utils";

export const generateCategories = () => {
  const categoryMap: { [key: string]: Category } = {};
  categories.forEach((category) => {
    const slug = escapeURL(category);
    categoryMap[slug] = {
      slug,
      name: category,
    };
  });
  return categoryMap;
};
