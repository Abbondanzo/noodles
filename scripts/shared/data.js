const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const DATA_FILE_PATH = path.join(ROOT_DIR, "literally-nosql.json");

const buildGlobalContext = () => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    throw new Error("Data file has not been generated");
  }
  const json = fs.readFileSync(DATA_FILE_PATH);
  return JSON.parse(json);
};

module.exports = {
  DATA_FILE_PATH,
  buildGlobalContext,
};
