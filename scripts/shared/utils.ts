import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Almost as random as pointing a camera at some lava lamps, but costs far less.
 */
export const getRandom = () => Math.sqrt(Math.random() * Math.random());

export const getRandomInRange = (min: number, max: number, round = true) => {
  if (min >= max) throw new Error("Minimum must be less than maximum");
  const randomNum = min + getRandom() * (max - min);
  return round ? Math.round(randomNum) : randomNum;
};

export function* createArrayGenerator(array: string[]) {
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

export const readPlaintextFile = (fileName: string) => {
  return fs
    .readFileSync(fileName, { encoding: "utf8", flag: "r" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

export const escapeURL = (url: string) => {
  url = url
    .replace(/[^A-Za-z0-9\s-]/g, "")
    .toLowerCase()
    .replace(/\s/g, "-");
  return encodeURIComponent(url);
};
