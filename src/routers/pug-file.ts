import fs from "fs";
import pug from "pug";
import { getPugFile } from "../utils";
import { Router } from "./_type";

/**
 * Tries to match the given route to a pug file by its path on the filesystem.
 */
export const pugFileRouter: Router = (route, context) => {
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
