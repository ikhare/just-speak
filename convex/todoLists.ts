import { v } from "convex/values";
import { appQueryWithAuth } from "./helpers";

export const getTodoLists = appQueryWithAuth({
  args: {},
  handler: async (ctx, args) => {
    // get all todo lists
    const todoLists = await ctx.db
      .query("todoLists")
      .filter((q) => q.eq(q.field("userId"), ctx.userId))
      .order("desc")
      .collect();

    return todoLists;
  },
});

export const getTodoList = appQueryWithAuth({
  args: { listId: v.id("todoLists") },
  handler: async (ctx, args) => {
    // get todo list
    const list = (await ctx.db.get(args.listId))!; // TODO: handle null
    return list;
  },
});
