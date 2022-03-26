import pug from "pug";
import { getContext } from "./context";
import { brandRouter } from "./routers/brand";
import { categoriesRouter } from "./routers/categories";
import { categoryRouter } from "./routers/category";
import { noodstarsRouter } from "./routers/noodstars";
import { pugFileRouter } from "./routers/pug-file";
import { viewEntryRouter } from "./routers/view-entry";
import { Context, Router } from "./routers/_type";

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
