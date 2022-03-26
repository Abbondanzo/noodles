import pug from "pug";
import { getPugFile, getTopBrands } from "../utils";
import { Router } from "./_type";

export const brandRouter: Router = (route, context) => {
  const match = route.match(/brand\/([A-z0-9-]+)\/?/);
  if (match) {
    const brandSlug = match[1];
    const selectedBrand = context.brands[brandSlug];
    if (selectedBrand) {
      const topBrands = getTopBrands(context);
      const topBrandSlugs = topBrands.map((brand) => brand.slug);
      const rank = topBrandSlugs.includes(brandSlug)
        ? topBrandSlugs.indexOf(brandSlug) + 1
        : topBrandSlugs.length +
          Object.keys(context.brands)
            .filter((slug) => !topBrandSlugs.includes(slug))
            .indexOf(brandSlug) +
          1;
      const videoViews = (() => {
        let numViews = 0;
        Object.keys(context.entries).forEach((entrySlug) => {
          if (context.entries[entrySlug].brandSlug === brandSlug) {
            numViews += context.entries[entrySlug].stats.views;
          }
        });
        return numViews;
      })();
      const pugFile = getPugFile("slugged/brand");
      return pug.renderFile(pugFile, {
        ...context,
        brand: selectedBrand,
        rank,
        videoViews,
      });
    }
  }

  return null;
};
