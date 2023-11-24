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
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.runQuery(internal.transcript.getFile, {
      fileId: args.fileId,
    });

    let blob: Blob;
    try {
      const maybeBlob = await ctx.storage.get(file.storageId);
      if (maybeBlob !== null) {
        blob = maybeBlob;
      } else {
        throw new ConvexError("File not found");
      }
    } catch (e) {
      throw new ConvexError("File not found");
    }

    const blobAsFile = new File([blob], "file.m4a", {
      lastModified: file._creationTime,
    });

    const openAI = new OpenAI();
    const transcription = await openAI.audio.transcriptions.create({
      file: blobAsFile,
      model: "whisper-1",
    });

    await ctx.runMutation(internal.transcript.storeTranscript, {
      transcription: transcription.text,
      fileId: args.fileId,
    });
  },
});

function dbGetFile(db: DatabaseReader, fileId: Id<"files">) {
  return db.get(fileId);
}

export const getFile = internalQuery({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    return await dbGetFile(ctx.db, args.fileId);
  },
});

export const storeTranscript = internalMutation({
  args: { transcription: v.string(), fileId: v.id("files") },
  handler: async (ctx, args) => {
    return ctx.db.insert("transcriptions", {
      fileId: args.fileId,
      text: args.transcription,
    });
  },
});
