const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_FILE_PATH = path.join(ROOT_DIR, "literally-nosql.json");

/**
 * @param {number} num
 * @returns {string}
 */
const truncateNumber = (num) => {
  if (num > 1e6) {
    return Math.floor(num / 1e6) + "M";
  } else if (num > 1e3) {
    return Math.floor(num / 1e3) + "K";
  } else {
    return num.toString();
  }
};

const getContext = () => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    throw new Error("Data file has not been generated");
  }
  const json = fs.readFileSync(DATA_FILE_PATH);
  return { ...JSON.parse(json), truncateNumber };
};

module.exports = {
  getContext,
};
