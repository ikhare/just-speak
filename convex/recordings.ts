import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { checkAuth } from "./helpers";

export const generateUploadUrl = mutation(async (ctx) => {
  await checkAuth(ctx);
  return await ctx.storage.generateUploadUrl();
});

export const saveRecording = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    const recId = await ctx.db.insert("recordings", {
      storageId: args.storageId,
      author: args.author,
      format: "audio",
    });
    ctx.scheduler.runAfter(0, internal.transcript.transcribe, { recId });
    return recId;
  },
});
