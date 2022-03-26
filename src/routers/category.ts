import pug from "pug";
import { getPugFile } from "../utils";
import { Router } from "./_type";

export const categoryRouter: Router = (route, context) => {
  const match = route.match(/category\/([A-z0-9-]+)\/?/);
  if (match) {
    const matchingId = match[1];
    const selectedCategory = context.categories[matchingId];
    if (selectedCategory) {
      const filteredEntries = Object.keys(context.entries)
        .map((entrySlug) => context.entries[entrySlug])
        .filter((entry) => entry.categorySlugs.includes(matchingId));
      const pugFile = getPugFile("slugged/category");
      return pug.renderFile(pugFile, {
        ...context,
        category: selectedCategory,
        filteredEntries,
      });
    }
  }

  return null;
};
