import fs from "fs";
import path from "path";
import { readPlaintextFile } from "./utils";

const dataDir = path.join(__dirname, "..", "..", "data");

export const brands = JSON.parse(
  fs.readFileSync(path.join(dataDir, "brands.json")).toString("utf8")
);

export const brandDescriptions = readPlaintextFile(
  path.join(dataDir, "brand-descriptions.txt")
);

export const categories = readPlaintextFile(
  path.join(dataDir, "categories.txt")
);

export const sections = readPlaintextFile(path.join(dataDir, "sections.txt"));

export const titles = readPlaintextFile(path.join(dataDir, "titles.txt"));

export const photos = fs.readdirSync(path.join(dataDir, "photos"));
