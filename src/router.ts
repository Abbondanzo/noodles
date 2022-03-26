import fs from "fs";
import path from "path";
import pug from "pug";
import { getContext } from "./context";
import { getTopBrands } from "./utils";

const VIEW_ROOT_DIR = path.join(__dirname, "views");

const getPugFile = (route: string) => {
  return path.join(VIEW_ROOT_DIR, `${route}.pug`);
};

type Context = Data & pug.Options & { baseURL: string };

/**
 * A Router checks the given route, and if it can handle that route it returns a string of rendered
 * HTML contents.
 */
type Router = (route: string, context: Context) => string | null;

const categoriesRouter: Router = (route, context) => {
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

const noodstarsRouter: Router = (route, context) => {
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

/**
 * Tries to match the given route to a pug file by its path on the filesystem.
 */
const pugFileRouter: Router = (route, context) => {
  let pugFile: string | undefined;
  if (fs.existsSync(getPugFile(route))) {
    pugFile = getPugFile(route);
  } else if (fs.existsSync(getPugFile(`${route}/index`))) {
    pugFile = getPugFile(`${route}/index`);
  }

  if (pugFile) {
    return pug.renderFile(pugFile, context);
  }

  return null;
};

const brandRouter: Router = (route, context) => {
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

const categoryRouter: Router = (route, context) => {
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

/**
 * Tries to match any view entry by the given path. For example:
 * - `/view/my-uuid` will render an entry if one exists by the ID `my-uuid`.
 */
const viewEntryRouter: Router = (route, context) => {
  const match = route.match(/view\/([A-z0-9-]+)\/?/);
  if (match) {
    const matchingId = match[1];
    const selectedEntry = context.entries[matchingId];
    if (selectedEntry) {
      const brand = context.brands[selectedEntry.brandSlug];
      const relatedVideos = Object.keys(context.entries)
        .filter(
          (entrySlug) =>
            context.entries[entrySlug].brandSlug === selectedEntry.brandSlug &&
            entrySlug !== selectedEntry.slug
        )
        .map((entrySlug) => context.entries[entrySlug]);
      const numBrandVideos = relatedVideos.length + 1;
      const recommendedSection =
        context.sections.find((section) =>
          section.title.toLowerCase().includes("recommended")
        ) || context.sections[0];
      const sidebarVideos = recommendedSection.entries
        .slice(0, 5)
        .map((entrySlug) => context.entries[entrySlug]);
      const pugFile = getPugFile("slugged/view");
      return pug.renderFile(pugFile, {
        ...context,
        entry: selectedEntry,
        brand,
        sidebarVideos,
        numBrandVideos,
        relatedVideos,
      });
    }
  }

  return null;
};

/**
 * Allows you to chain over a list of routers. Will return early on the first router that returns
 * a truthy string value.
 */
const routerPipe =
  (routers: Router[]) =>
  (route: string, options: pug.Options & { baseURL?: string } = {}) => {
    const baseOptions: Context = {
      ...getContext(),
      baseURL: "",
    };
    for (const router of routers) {
      const routerResult = router(route, { ...baseOptions, ...options });
      if (routerResult) {
        return routerResult;
      }
    }
    return null;
  };

export const appRouter = routerPipe([
  categoriesRouter,
  noodstarsRouter,
  pugFileRouter,
  brandRouter,
  categoryRouter,
  viewEntryRouter,
]);
