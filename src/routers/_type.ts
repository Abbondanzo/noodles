import pug from "pug";

export type Context = Data & pug.Options & { baseURL: string };

/**
 * A Router checks the given route, and if it can handle that route it returns a string of rendered
 * HTML contents.
 */
export type Router = (route: string, context: Context) => string | null;
