import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "..", "data");

const sanitizePhotoNames = () => {
  const photoDir = path.join(DATA_DIR, "photos");
  const files = fs.readdirSync(photoDir);
  files.forEach((fileName, index) => {
    const extensionMatch = fileName.match(/\.([A-z0-9]+)$/)!;
    const extension = extensionMatch[1];
    const newFileName = `${String(index + 1).padStart(
      2,
      "0"
    )}.${extension.toLowerCase()}`;
    fs.renameSync(
      path.join(photoDir, fileName),
      path.join(photoDir, newFileName)
    );
  });
};

sanitizePhotoNames();
