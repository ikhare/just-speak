import { v } from "convex/values";
import { appQueryWithAuth } from "./helpers";

export const getNotes = appQueryWithAuth({
  args: {},
  handler: async (ctx, args) => {
    // get all recordings
    const recordings = await ctx.db
      .query("recordings")
      .filter((q) => q.eq(q.field("userId"), ctx.userId))
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

export const getNote = appQueryWithAuth({
  args: { recId: v.id("recordings") },
  handler: async (ctx, args) => {
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

export const getNoteAudio = appQueryWithAuth({
  args: { recId: v.id("recordings") },
  handler: async (ctx, args) => {
    // get recording
    const recording = (await ctx.db.get(args.recId))!; // TODO: handle null
    return {
      recId: recording._id,
      audio: await ctx.storage.getUrl(recording.storageId),
    };
  },
});
