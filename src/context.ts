import fs from "fs";
import path from "path";

const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_FILE_PATH = path.join(ROOT_DIR, "literally-nosql.json");

const truncateNumber = (num: number): string => {
  if (num > 1e9) {
    return Math.floor(num / 1e9) + "B";
  } else if (num > 1e6) {
    return Math.floor(num / 1e6) + "M";
  } else if (num > 1e3) {
    return Math.floor(num / 1e3) + "K";
  } else {
    return num.toString();
  }
};

export const getContext = (): Data => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    throw new Error("Data file has not been generated");
  }
  const json = fs.readFileSync(DATA_FILE_PATH).toString("utf-8");
  return { ...JSON.parse(json), truncateNumber };
};
