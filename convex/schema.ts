import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    recordings: defineTable({
      userId: v.string(),
      format: v.string(),
      storageId: v.id("_storage"),
    }),
    transcriptions: defineTable({
      recordingId: v.id("recordings"),
      text: v.string(),
    }),
    reminders: defineTable({
      userId: v.string(),
      recordingId: v.id("recordings"),
      when: v.number(),
      text: v.string(),
    }),
    journal: defineTable({
      userId: v.string(),
      recordingId: v.id("recordings"),
      body: v.string(),
      tweet: v.string(),
      title: v.string(),
    }),
    todoLists: defineTable({
      userId: v.string(),
      recordingId: v.id("recordings"),
      list: v.array(v.string()),
      title: v.string(),
      description: v.optional(v.string()),
    }),
  },
  { schemaValidation: false }
);
