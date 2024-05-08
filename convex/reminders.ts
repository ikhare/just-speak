import { v } from "convex/values";
import { appQueryWithAuth } from "./helpers";

export const getReminders = appQueryWithAuth({
  args: {},
  handler: async (ctx, args) => {
    // get all reminders
    const reminders = await ctx.db
      .query("reminders")
      .filter((q) => q.eq(q.field("userId"), ctx.userId))
      .order("desc")
      .collect();

    return reminders;
  },
});

export const getReminder = appQueryWithAuth({
  args: { reminderId: v.id("reminders") },
  handler: async (ctx, args) => {
    // get reminder
    const reminder = (await ctx.db.get(args.reminderId))!; // TODO: handle null
    return reminder;
  },
});
