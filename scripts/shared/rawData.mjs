import fs from "fs";
import path from "path";
import { getDirname, readPlaintextFile } from "./utils.mjs";

const dataDir = path.join(getDirname(import.meta.url), "..", "..", "data");

export const brands = readPlaintextFile(path.join(dataDir, "brands.txt"));

export const categories = readPlaintextFile(
  path.join(dataDir, "categories.txt")
);

export const sections = readPlaintextFile(path.join(dataDir, "sections.txt"));

export const titles = readPlaintextFile(path.join(dataDir, "titles.txt"));

export const photos = fs.readdirSync(path.join(dataDir, "photos"));