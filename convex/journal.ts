import { v } from "convex/values";
import { appQueryWithAuth } from "./helpers";

export const getJournalEntries = appQueryWithAuth({
  args: {},
  handler: async (ctx, _args) => {
    // get all journal entries
    const entries = await ctx.db
      .query("journal")
      .filter((q) => q.eq(q.field("userId"), ctx.userId))
      .order("desc")
      .collect();

    return entries;
  },
});

export const getJournalEntry = appQueryWithAuth({
  args: { entryId: v.id("journal") },
  handler: async (ctx, args) => {
    // get journal entry
    const entry = (await ctx.db.get(args.entryId))!; // TODO: handle null
    return entry;
  },
});
