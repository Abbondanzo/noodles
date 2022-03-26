import pug from "pug";
import { getPugFile, getTopBrands } from "../utils";
import { Router } from "./_type";

export const noodstarsRouter: Router = (route, context) => {
  if (route !== "/noodstars") {
    return null;
  }
  const topBrands = getTopBrands(context);
  const remainingBrands = Object.keys(context.brands).filter(
    (brandSlug) => !topBrands.includes(context.brands[brandSlug])
  );
  const numVideosForBrand = (brandSlug: string) => {
    let numVideos = 0;
    Object.keys(context.entries).forEach((entrySlug) => {
      if (context.entries[entrySlug].brandSlug === brandSlug) {
        numVideos++;
      }
    });
    return numVideos;
  };
  const numViewsForBrand = (brandSlug: string) => {
    let numViews = 0;
    Object.keys(context.entries).forEach((entrySlug) => {
      if (context.entries[entrySlug].brandSlug === brandSlug) {
        numViews += context.entries[entrySlug].stats.views;
      }
    });
    return numViews;
  };
  const pugFile = getPugFile("noodstars");
  return pug.renderFile(pugFile, {
    ...context,
    topBrands,
    remainingBrands,
    numVideosForBrand,
    numViewsForBrand,
  });
};
