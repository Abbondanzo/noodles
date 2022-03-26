import pug from "pug";
import { getPugFile } from "../utils";
import { Router } from "./_type";

export const categoriesRouter: Router = (route, context) => {
  if (route !== "/categories") {
    return null;
  }

  const entryList = Object.keys(context.entries).map(
    (entrySlug) => context.entries[entrySlug]
  );
  const sampleCategories: {
    entrySlug: string;
    categorySlug: string;
    numVideos: number;
  }[] = [];
  Object.keys(context.categories).forEach((categorySlug) => {
    const sampleEntry =
      entryList.find((entry) => {
        // Find an entry that is not already in the sample list
        return (
          entry.categorySlugs.includes(categorySlug) &&
          !sampleCategories.find((sample) => sample.entrySlug === entry.slug)
        );
      }) ||
      // If unable to find one, fall back to duplicate entry
      entryList.find((entry) => {
        return entry.categorySlugs.includes(categorySlug);
      });
    let numVideos = 0;
    entryList.forEach((entry) => {
      if (entry.categorySlugs.includes(categorySlug)) {
        numVideos++;
      }
    });
    sampleCategories.push({
      entrySlug: sampleEntry!.slug,
      categorySlug,
      numVideos,
    });
  });
  const pugFile = getPugFile("categories");
  return pug.renderFile(pugFile, { ...context, sampleCategories });
};
