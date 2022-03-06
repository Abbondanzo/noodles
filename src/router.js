const fs = require("fs");
const path = require("path");
const pug = require("pug");
const { getContext } = require("./context");

const VIEW_ROOT_DIR = path.join(__dirname, "views");

/**
 * A Router checks the given route, and if it can handle that route it returns a string of rendered
 * HTML contents.
 *
 * @callback Router
 * @param {string} route
 * @param {Object} options
 * @returns {string | null}
 */

/**
 * Tries to match the given route to a pug file by its path on the filesystem.
 *
 * @type {Router}
 */
const pugFileRouter = (route, options) => {
  let pugFile;
  if (fs.existsSync(path.join(VIEW_ROOT_DIR, `${route}.pug`))) {
    pugFile = path.join(VIEW_ROOT_DIR, `${route}.pug`);
  } else if (fs.existsSync(path.join(VIEW_ROOT_DIR, route, "index.pug"))) {
    pugFile = path.join(VIEW_ROOT_DIR, route, "index.pug");
  }

  if (pugFile) {
    return pug.renderFile(pugFile, {
      ...options,
      ...getContext(),
    });
  }

  return null;
};

/**
 * Tries to match any view entry by the given path. For example:
 * - `/view/my-uuid` will render an entry if one exists by the ID `my-uuid`.
 *
 * @type {Router}
 */
const viewEntryRouter = (route, options) => {
  const match = route.match(/view\/([A-z0-9-]+)\/?/);
  if (match) {
    const matchingId = match[1];
    const context = getContext();
    if (context.entries[matchingId]) {
      const selectedEntry = context.entries[matchingId];
      const pugFile = path.join(VIEW_ROOT_DIR, "slugged", "view.pug");
      return pug.renderFile(pugFile, {
        ...options,
        entry: selectedEntry,
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
    for (const router of routers) {
      const routerResult = router(route, options);
      if (routerResult) {
        return routerResult;
      }
    }
    return null;
  };

const appRouter = routerPipe([pugFileRouter, viewEntryRouter]);

module.exports = {
  appRouter,
};
