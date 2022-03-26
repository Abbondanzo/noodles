import fs from "fs";
import { generateBrands } from "./generators/generateBrands";
import { generateCategories } from "./generators/generateCategories";
import { generateEntries } from "./generators/generateEntries";
import { generateSections } from "./generators/generateSections";
import { dataOutputFile } from "./shared/paths";

const run = () => {
  const brands = generateBrands();
  const categories = generateCategories();
  const entries = generateEntries(Object.keys(brands), Object.keys(categories));
  const sections = generateSections(Object.keys(entries));

  const data: Data = {
    brands,
    categories,
    entries,
    sections,
  };

  fs.writeFileSync(dataOutputFile, JSON.stringify(data, null, 2) + "\n");
};

run();
