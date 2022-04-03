import pug from "pug";
import { getPugFile, getTopBrands } from "../utils";
import { Router } from "./_type";

const MAX_COMMENTS_TO_DISPLAY = 25;

export const communityRouter: Router = (route, context) => {
  if (route !== "/community") {
    return null;
  }
  const commentFeed: { comment: EntryComment; entry: Entry }[] = [];
  const entrySlugs = Object.keys(context.entries);
  while (commentFeed.length < MAX_COMMENTS_TO_DISPLAY) {
    const randomEntrySlug =
      entrySlugs[Math.floor(Math.random() * entrySlugs.length)];
    const randomEntry = context.entries[randomEntrySlug];
    const randomCommentIndex = Math.floor(
      Math.random() * randomEntry.comments.length
    );
    const randomComment = randomEntry.comments[randomCommentIndex];
    const isCommentUnique = !commentFeed.find((item) => {
      item.comment.body === randomComment.body;
    });
    // Ignore repeat comments
    if (isCommentUnique) {
      commentFeed.push({ comment: randomComment, entry: randomEntry });
    }
  }

  const pugFile = getPugFile("community");
  return pug.renderFile(pugFile, {
    ...context,
    commentFeed,
  });
};
