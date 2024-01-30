import { v } from "convex/values";
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
        // console.log("transcription", transcription);
        const label = transcription?.text
          ? transcription.text.substring(0, 40).concat("...")
          : null;
        return {
          creationTime: file._creationTime,
          fileId: file._id,
          label: label,
        };
      })
    );
  },
});

export const getNote = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    // get user
    await checkAuth(ctx);
    // get file
    const file = await ctx.db.get(args.fileId);
    // get transcript
    const transcription = await ctx.db
      .query("transcriptions")
      .filter((q) => q.eq(q.field("fileId"), file._id))
      .first();
    // console.log("transcription", transcription);
    return {
      fileId: file._id,
      creationTime: file._creationTime,
      text: transcription?.text || "",
    };
  },
});
