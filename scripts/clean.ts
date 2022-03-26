import fs from "fs";
import path from "path";

const DIST_DIR = path.resolve(__dirname, "..", "dist");

fs.rmSync(DIST_DIR, { recursive: true, force: true });
