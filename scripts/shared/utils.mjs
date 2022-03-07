import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Almost as random as pointing a camera at some lava lamps, but costs far less.
 * @returns {number}
 */
export const getRandom = () => Math.sqrt(Math.random() * Math.random());

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const getRandomInRange = (min, max) => {
  if (min >= max) throw new Error("Minimum must be less than maximum");
  return min + getRandom() * (max - min);
};

/**
 * @param {Array<string>} array
 * @returns {Generator<string, void, void>}
 */
export function* createArrayGenerator(array) {
  let currentArray = [...array];
  while (true) {
    if (currentArray.length === 0) {
      currentArray = [...array];
    }
    const indexToPop = Math.floor(getRandom() * currentArray.length);
    const [arrayItem] = currentArray.splice(indexToPop, 1);
    yield arrayItem;
  }
}

/**
 * @param {string} fileName
 * @returns {Array<string>}
 */
export const readPlaintextFile = (fileName) => {
  return fs
    .readFileSync(fileName, { encoding: "utf8", flag: "r" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

/**
 * @param {string} url
 * @returns {string}
 */
export const escapeURL = (url) => {
  url = url
    .replace(/[^A-z0-9\s-]/g, "")
    .toLowerCase()
    .replace(/\s/g, "-");
  return encodeURIComponent(url);
};

/**
 * @param {string} importMetaUrl
 * @returns {string}
 */
export const getDirname = (importMetaUrl) => {
  return path.dirname(fileURLToPath(importMetaUrl));
};
