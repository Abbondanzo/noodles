const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { DATA_FILE_PATH } = require("./shared/data");

// Paths
const DATA_DIR = path.resolve(__dirname, "..", "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.txt");
const MAKES_FILE = path.join(DATA_DIR, "makes.txt");
const SECTIONS_FILE = path.join(DATA_DIR, "sections.txt");
const TITLES_FILE = path.join(DATA_DIR, "titles.txt");
const PICTURES_DIR = path.join(DATA_DIR, "photos");

// Variables
const LOG_DEBUG = true;
const CHANCE_TO_INVERT_PICTURE = 0.3;
const MIN_CATEGORY_COUNT = 2;
const MAX_CATEGORY_COUNT = 5;
const NUM_ENTRIES_FIRST_SECTION = 12;
const NUM_ENTRIES_PER_SECTION = 5;
const MIN_VIEWS = 1e5;
const MAX_VIEWS = 4.5e6;

/**
 * Almost as random as pointing a camera at some lava lamps, but costs far less.
 * @returns {number}
 */
const getRandom = () => Math.sqrt(Math.random() * Math.random());

/**
 * @param {Array<string>} array
 * @returns {Generator<string, void, void>}
 */
function* createArrayGenerator(array) {
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
const readPlaintextFile = (fileName) => {
  return fs
    .readFileSync(fileName, { encoding: "utf8", flag: "r" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

/**
 * @typedef Picture
 * @property {string} fileName
 * @property {boolean} invert
 */

/**
 * @typedef {Object} Entry
 * @property {string} id
 * @property {string} make
 * @property {string} title
 * @property {string} views
 * @property {Array<string>} categories
 * @property {Picture} picture
 */

const generateRandomViewCount = () => {
  const toAdd = (MAX_VIEWS - MIN_VIEWS) * getRandom();
  const numViews = MIN_VIEWS + toAdd;
  if (numViews > 1e6) {
    return `${Math.round(numViews / 1e5) / 10}M`;
  }
  return `${Math.round(numViews / 1e3)}K`;
};

const generateEntries = () => {
  const titles = readPlaintextFile(TITLES_FILE);
  const categories = readPlaintextFile(CATEGORIES_FILE);

  const pictureFiles = fs.readdirSync(PICTURES_DIR);
  const pictureGenerator = createArrayGenerator(pictureFiles);

  const makes = readPlaintextFile(MAKES_FILE);
  const makesGenerator = createArrayGenerator(makes);

  /**
   * @type {Object.<string, Entry>}
   */
  const output = {};

  titles.forEach((title) => {
    // Always include categories that are mentioned in the title
    const titleCategories = categories.filter((category) =>
      title.toLowerCase().includes(category.toLowerCase())
    );
    const minCategoriesToAdd =
      Math.floor(getRandom() * (MAX_CATEGORY_COUNT - MIN_CATEGORY_COUNT)) +
      MIN_CATEGORY_COUNT;
    while (titleCategories.length < minCategoriesToAdd) {
      if (minCategoriesToAdd > categories.length) {
        break;
      }
      // O(n^2) because I like exponential numbers
      const remainingCategories = categories.filter(
        (category) => !titleCategories.includes(category)
      );
      const remainingCategoryIndex = Math.floor(
        getRandom() * remainingCategories.length
      );
      titleCategories.push(remainingCategories[remainingCategoryIndex]);
    }

    const invert = getRandom() <= CHANCE_TO_INVERT_PICTURE;
    /**
     * @type {Picture}
     */
    const picture = {
      invert,
      fileName: pictureGenerator.next().value,
    };

    const entryId = crypto.randomUUID();
    output[entryId] = {
      id: entryId,
      title,
      make: makesGenerator.next().value,
      categories: titleCategories,
      views: generateRandomViewCount(),
      picture,
    };
  });

  return output;
};

/**
 * @typedef {Object} Section
 * @property {string} title
 * @property {Array<string>} entries
 */

/**
 * @param {Array<Entry>} entries
 * @returns {Array<Section>}
 */
const generateSections = (entryIds) => {
  const sections = readPlaintextFile(SECTIONS_FILE);
  const entryIdGenerator = createArrayGenerator(entryIds);
  return sections.map((sectionTitle, index) => {
    /**
     * @type {Array<string>}
     */
    const sectionEntryIds = [];
    let numEntriesInSection =
      index === 0 ? NUM_ENTRIES_FIRST_SECTION : NUM_ENTRIES_PER_SECTION;
    while (numEntriesInSection > 0) {
      const entryId = entryIdGenerator.next().value;
      sectionEntryIds.push(entryId);
      numEntriesInSection--;
    }
    return {
      title: sectionTitle,
      entries: sectionEntryIds,
    };
  });
};

const escapeURL = (url) => {
  return encodeURIComponent(url.toLowerCase().replaceAll(" ", "-")).replaceAll(
    "'",
    ""
  );
};

const run = () => {
  if (LOG_DEBUG) console.time("generateEntries");
  const entries = generateEntries();
  if (LOG_DEBUG) {
    console.timeEnd("generateEntries");
    console.log(`Generated ${Object.keys(entries).length} entries`);
  }

  const sections = generateSections(Object.keys(entries));

  // Create SLUG maps
  /**
   * @type {Object.<string, string>}
   */
  const categorySlugs = {};
  readPlaintextFile(CATEGORIES_FILE).forEach((category) => {
    categorySlugs[category] = escapeURL(category);
  });
  /**
   * @type {Object.<string, string>}
   */
  const makeSlugs = {};
  readPlaintextFile(MAKES_FILE).forEach((make) => {
    makeSlugs[make] = escapeURL(make);
  });

  const data = {
    entries,
    sections,
    categorySlugs,
    makeSlugs,
  };

  const dataFileDir = path.join(DATA_FILE_PATH, "..");
  if (!fs.existsSync(dataFileDir)) {
    fs.mkdirSync(dataFileDir);
  }
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2) + "\n");
};

run();
