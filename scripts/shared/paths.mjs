import path from "path";
import { getDirname } from "./utils.mjs";

export const dataOutputFile = path.join(
  getDirname(import.meta.url),
  "..",
  "..",
  "literally-nosql.json"
);
