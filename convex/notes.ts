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

    // get all recordings
    const recordings = await ctx.db
      .query("recordings")
      .filter((q) => q.eq(q.field("author"), userId))
      .order("desc")
      .collect();

    // get all transcripts and create a new return value
    return Promise.all(
      recordings.map(async (recording) => {
        const transcription = await ctx.db
          .query("transcriptions")
          .filter((q) => q.eq(q.field("recordingId"), recording._id))
          .first();
        // console.log("transcription", transcription);
        const label = transcription?.text
          ? transcription.text.substring(0, 40).concat("...")
          : null;
        return {
          creationTime: recording._creationTime,
          recId: recording._id,
          label: label,
        };
      })
    );
  },
});

export const getNote = query({
  args: { recId: v.id("recordings") },
  handler: async (ctx, args) => {
    // get user
    await checkAuth(ctx);
    // get recording
    const recording = (await ctx.db.get(args.recId))!; // TODO: handle null
    // get transcript
    const transcription = await ctx.db
      .query("transcriptions")
      .filter((q) => q.eq(q.field("recordingId"), recording._id))
      .first();
    // console.log("transcription", transcription);
    return {
      recId: recording._id,
      creationTime: recording._creationTime,
      text: transcription?.text || "",
    };
  },
});
