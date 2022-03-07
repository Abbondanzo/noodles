import fs from "fs";
import { generateBrands } from "./generators/generateBrands.mjs";
import { generateCategories } from "./generators/generateCategories.mjs";
import { generateEntries } from "./generators/generateEntries.mjs";
import { generateSections } from "./generators/generateSections.mjs";
import { dataOutputFile } from "./shared/paths.mjs";

const run = () => {
  const brands = generateBrands();
  const categories = generateCategories();
  const entries = generateEntries(Object.keys(brands), Object.keys(categories));
  const sections = generateSections(Object.keys(entries));

  const data = {
    brands,
    categories,
    entries,
    sections,
  };

  fs.writeFileSync(dataOutputFile, JSON.stringify(data, null, 2) + "\n");
};

run();
