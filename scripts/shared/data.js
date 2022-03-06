const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const DATA_FILE_PATH = path.join(ROOT_DIR, "literally-nosql.json");

module.exports = {
  DATA_FILE_PATH,
};
