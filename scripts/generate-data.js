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
// Stats Variables
const MIN_VIEWS = 1e5;
const MAX_VIEWS = 4.5e6;
const MIN_DAYS_UPLOADED = 1;
const MAX_DAYS_UPLOADED = 30 * 9;
const MIN_LIKE_RATIO = 0.7;
const MAX_LIKE_RATIO = 0.99;
const MIN_LIKES = 150;
const MAX_LIKES = 5e3;
const MIN_FAVORITES = 50;
const MAX_FAVORITES = 1.5e3;

/**
 * Almost as random as pointing a camera at some lava lamps, but costs far less.
 * @returns {number}
 */
const getRandom = () => Math.sqrt(Math.random() * Math.random());

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const getRandomInRange = (min, max) => {
  if (min >= max) throw new Error("Minimum must be less than maximum");
  return min + getRandom() * (max - min);
};

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
 * @typedef Stats
 * @property {string} views
 * @property {string} uploadTime
 * @property {number} likes
 * @property {number} dislikes
 * @property {number} favorites
 */

/**
 * @typedef {Object} Entry
 * @property {string} id
 * @property {string} make
 * @property {string} title
 * @property {Stats} stats
 * @property {Array<string>} categories
 * @property {Picture} picture
 */

const generateRandomViewCount = () => {
  const numViews = getRandomInRange(MIN_VIEWS, MAX_VIEWS);
  if (numViews > 1e6) {
    return `${Math.round(numViews / 1e5) / 10}M`;
  }
  return `${Math.round(numViews / 1e3)}K`;
};

const generateRandomUploadTime = () => {
  const daysAgo = getRandomInRange(MIN_DAYS_UPLOADED, MAX_DAYS_UPLOADED);
  if (daysAgo > 30) {
    const months = Math.round(daysAgo / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const days = Math.round(daysAgo);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
};

/** @returns {Stats} */
const generateStats = () => {
  const likes = Math.floor(getRandomInRange(MIN_LIKES, MAX_LIKES));
  const likeRatio = getRandomInRange(MIN_LIKE_RATIO, MAX_LIKE_RATIO);
  const dislikes = Math.round(likes / likeRatio - likes);
  const favorites = Math.round(getRandomInRange(MIN_FAVORITES, MAX_FAVORITES));
  return {
    views: generateRandomViewCount(),
    uploadTime: generateRandomUploadTime(),
    likes,
    dislikes,
    favorites,
  };
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
      stats: generateStats(),
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

/**
 * @param {string} url
 * @returns {string}
 */
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
