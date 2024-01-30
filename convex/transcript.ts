import { ConvexError, v } from "convex/values";
import {
  DatabaseReader,
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { OpenAI } from "openai";
import { Id } from "./_generated/dataModel";

export const transcribe = internalAction({
  args: {
    recId: v.id("recordings"),
  },
  handler: async (ctx, args) => {
    const recording = (await ctx.runQuery(internal.transcript.getRecording, {
      recId: args.recId,
    }))!; // TODO: handle null

    let blob: Blob;
    try {
      const maybeBlob = await ctx.storage.get(recording.storageId);
      if (maybeBlob !== null) {
        blob = maybeBlob;
      } else {
        throw new ConvexError("Recording not found");
      }
    } catch (e) {
      throw new ConvexError("Recording not found");
    }

    const blobAsFile = new File([blob], "file.m4a", {
      lastModified: recording._creationTime,
    });

    const openAI = new OpenAI();
    const transcription = await openAI.audio.transcriptions.create({
      file: blobAsFile,
      model: "whisper-1",
    });

    await ctx.runMutation(internal.transcript.storeTranscript, {
      transcription: transcription.text,
      recId: args.recId,
    });
  },
});

function dbGetRecording(db: DatabaseReader, recId: Id<"recordings">) {
  return db.get(recId);
}

export const getRecording = internalQuery({
  args: {
    recId: v.id("recordings"),
  },
  handler: async (ctx, args) => {
    return await dbGetRecording(ctx.db, args.recId);
  },
});

export const storeTranscript = internalMutation({
  args: { transcription: v.string(), recId: v.id("recordings") },
  handler: async (ctx, args) => {
    return ctx.db.insert("transcriptions", {
      recordingId: args.recId,
      text: args.transcription,
    });
  },
});
