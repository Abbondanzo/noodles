import pug from "pug";

interface Extras {
  baseURL: string;
  routes: string[];
}

export type Context = Data & pug.Options & Extras;

/**
 * A Router checks the given route, and if it can handle that route it returns a string of rendered
 * HTML contents.
 */
export type Router = (route: string, context: Context) => string | null;
