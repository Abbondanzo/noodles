import { sections } from "../shared/rawData";
import { createArrayGenerator } from "../shared/utils";

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
export const generateSections = (entryIds: string[]): Section[] => {
  const entryIdGenerator = createArrayGenerator(entryIds);
  return sections.map((sectionTitle, index) => {
    const sectionEntryIds: string[] = [];
    let numEntriesInSection =
      index === 0 ? NUM_ENTRIES_FIRST_SECTION : NUM_ENTRIES_PER_SECTION;
    while (numEntriesInSection > 0) {
      const entryId = String(entryIdGenerator.next().value);
      sectionEntryIds.push(entryId);
      numEntriesInSection--;
    }
    return {
      title: sectionTitle,
      entries: sectionEntryIds,
    };
  });
};
