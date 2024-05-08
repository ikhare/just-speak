import { v } from "convex/values";
import { internal } from "./_generated/api";
import { appMutationWithAuth, checkAuth } from "./helpers";

export const generateUploadUrl = appMutationWithAuth(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveRecording = appMutationWithAuth({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, args) => {
    const recId = await ctx.db.insert("recordings", {
      storageId: args.storageId,
      userId: args.author,
      format: "audio",
    });
    ctx.scheduler.runAfter(0, internal.transcript.transcribe, { recId });
    return recId;
  },
});
