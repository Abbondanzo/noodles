import pug from "pug";
import { getPugFile } from "../utils";
import { Router } from "./_type";

/**
 * Tries to match any view entry by the given path. For example:
 * - `/view/my-uuid` will render an entry if one exists by the ID `my-uuid`.
 */
export const viewEntryRouter: Router = (route, context) => {
  const match = route.match(/view\/([A-z0-9-]+)\/?/);
  if (match) {
    const matchingId = match[1];
    const selectedEntry = context.entries[matchingId];
    if (selectedEntry) {
      const brand = context.brands[selectedEntry.brandSlug];
      const relatedVideos = Object.keys(context.entries)
        .filter(
          (entrySlug) =>
            context.entries[entrySlug].brandSlug === selectedEntry.brandSlug &&
            entrySlug !== selectedEntry.slug
        )
        .map((entrySlug) => context.entries[entrySlug]);
      const numBrandVideos = relatedVideos.length + 1;
      const recommendedSection =
        context.sections.find((section) =>
          section.title.toLowerCase().includes("recommended")
        ) || context.sections[0];
      const sidebarVideos = recommendedSection.entries
        .slice(0, 5)
        .map((entrySlug) => context.entries[entrySlug]);
      const pugFile = getPugFile("slugged/view");
      return pug.renderFile(pugFile, {
        ...context,
        entry: selectedEntry,
        brand,
        sidebarVideos,
        numBrandVideos,
        relatedVideos,
      });
    }
  }

  return null;
};
