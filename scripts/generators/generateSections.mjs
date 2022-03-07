import { sections } from "../shared/rawData.mjs";
import { createArrayGenerator } from "../shared/utils.mjs";

const NUM_ENTRIES_FIRST_SECTION = 12;
const NUM_ENTRIES_PER_SECTION = 5;

/**
 * @typedef {Object} Section
 * @property {string} title
 * @property {Array<string>} entries
 */

/**
 * @param {Array<string>} entryIds
 * @returns {Array<Section>}
 */
export const generateSections = (entryIds) => {
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
