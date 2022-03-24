const fs = require("fs");
const path = require("path");
const pug = require("pug");
const { getContext } = require("./context");

const VIEW_ROOT_DIR = path.join(__dirname, "views");

const getPugFile = (route) => {
  return path.join(VIEW_ROOT_DIR, `${route}.pug`);
};

/**
 * A Router checks the given route, and if it can handle that route it returns a string of rendered
 * HTML contents.
 *
 * @callback Router
 * @param {string} route
 * @param {Object} context
 * @returns {string | null}
 */

/**
 * @type {Router}
 */
const categoriesRouter = (route, context) => {
  if (route === "/categories") {
    console.log("categories");
  }
  return null;
};

/**
 * Tries to match the given route to a pug file by its path on the filesystem.
 *
 * @type {Router}
 */
const pugFileRouter = (route, context) => {
  let pugFile;
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

/**
 * @type {Router}
 */
const brandRouter = (route, context) => {
  const match = route.match(/brand\/([A-z0-9-]+)\/?/);
  if (match) {
    const matchingId = match[1];
    const selectedBrand = context.brands[matchingId];
    if (selectedBrand) {
      const pugFile = getPugFile("slugged/brand");
      return pug.renderFile(pugFile, {
        ...context,
        brand: selectedBrand,
      });
    }
  }

  return null;
};

/**
 * @type {Router}
 */
const categoryRouter = (route, context) => {
  const match = route.match(/category\/([A-z0-9-]+)\/?/);
  if (match) {
    const matchingId = match[1];
    const selectedCategory = context.categories[matchingId];
    if (selectedCategory) {
      const pugFile = getPugFile("slugged/category");
      return pug.renderFile(pugFile, {
        ...context,
        category: selectedCategory,
      });
    }
  }

  return null;
};

/**
 * Tries to match any view entry by the given path. For example:
 * - `/view/my-uuid` will render an entry if one exists by the ID `my-uuid`.
 *
 * @type {Router}
 */
const viewEntryRouter = (route, context) => {
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
 *
 * @param {Array<Router>} routers
 * @returns {Router}
 */
const routerPipe =
  (routers) =>
  (route, options = {}) => {
    const baseOptions = {
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

const appRouter = routerPipe([
  categoriesRouter,
  pugFileRouter,
  brandRouter,
  categoryRouter,
  viewEntryRouter,
]);

module.exports = {
  appRouter,
};
