const fs = require("fs");
const path = require("path");

const DIST_DIR = path.resolve(__dirname, "..", "dist");

fs.rmSync(DIST_DIR, { recursive: true, force: true });
