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
      const videos: Entry[] = [];
      let numVideoViews = 0;
      Object.keys(context.entries).forEach((entrySlug) => {
        const entry = context.entries[entrySlug];
        if (entry.brandSlug === brandSlug) {
          videos.push(entry);
          numVideoViews += entry.stats.views;
        }
      });

      const pugFile = getPugFile("slugged/brand");
      return pug.renderFile(pugFile, {
        ...context,
        brand: selectedBrand,
        rank,
        numVideoViews,
        videos,
      });
    }
  }

  return null;
};
