import { query } from "./_generated/server";
import { checkAuth, idFromTokenIdentifier } from "./helpers";

export const getNotes = query({
  args: {},
  handler: async (ctx, args) => {
    // get user
    const identity = await checkAuth(ctx);
    const userId = idFromTokenIdentifier(identity.tokenIdentifier);
    // console.log("userId", userId);

    // get all files
    const files = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("author"), userId))
      .order("desc")
      .collect();

    // get all transcripts and create a new return value
    return Promise.all(
      files.map(async (file) => {
        const transcription = await ctx.db
          .query("transcriptions")
          .filter((q) => q.eq(q.field("fileId"), file._id))
          .first();
        console.log("transcription", transcription);
        const label = transcription?.text
          ? transcription.text.substring(0, 40).concat("...")
          : `Note created on ${new Date(file._creationTime).toLocaleString()}`;
        return {
          creationTime: file._creationTime,
          fileId: file._id,
          label: label,
        };
      })
    );
  },
});
