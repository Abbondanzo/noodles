import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { readPlaintextFile } from "./utils";

const dataDir = path.join(__dirname, "..", "..", "data");

interface RawBrand {
  name: string;
  sites: { name: string; url: string }[];
  attributes: { [key: string]: any };
}

export const brands: RawBrand[] = parse(
  fs.readFileSync(path.join(dataDir, "brands.yml")).toString("utf8")
);

export const brandDescriptions = readPlaintextFile(
  path.join(dataDir, "brand-descriptions.txt")
);

export const categories = readPlaintextFile(
  path.join(dataDir, "categories.txt")
);

export const comments = readPlaintextFile(path.join(dataDir, "comments.txt"));

export const sections = readPlaintextFile(path.join(dataDir, "sections.txt"));

export const titles = readPlaintextFile(path.join(dataDir, "titles.txt"));

export const photos = fs.readdirSync(path.join(dataDir, "photos"));

export const usernames = readPlaintextFile(path.join(dataDir, "usernames.txt"));
