import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recordings: defineTable({
    author: v.string(),
    format: v.string(),
    storageId: v.id("_storage"),
  }),
  transcriptions: defineTable({
    recordingId: v.id("recordings"),
    text: v.string(),
  }),
});
