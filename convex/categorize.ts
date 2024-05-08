import OpenAI from "openai";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

async function categorize(transcript: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You a helpful assistant. You take the text I send you and automatically categorize it. You return the categories in JSON format. The first key in the JSON response called `category` and the value is one of:\n1. `reminder` if you determine the text is a reminder.\n2. `todo` if it’s a todo list\n3. `journal` for any other unstructured thought\n\nIf the category is reminder. Then add a key called `when` with it’s value as an ISO 8601 date and time in UTC for when the reminder should be set.  This time should be relative to `" +
          new Date().toISOString() +
          "`. Add a another key called `text` with the value as a string of the text to be reminded.\n\nIf the category is a todo list. Then add a key called `list` which is an array of strings of each todo list item. Add another key called `title` where you generated a short 1-5 word title for the todo list. Add another optional key called `description` which gives the any relevant information about the todo list that is not captured in the rest of the JSON for this category.\n\nIf the category is journal. Then add a key called `body` with the raw original text. Then add a key called `tweet` which is a max 280 character sized summary to be used at twitter.com. Add another key called `title` which is a 1-10 word title of the journal entry.",
      },
      {
        role: "user",
        content: transcript,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return JSON.parse(response.choices[0].message.content!);
}

export const categorizeTranscript = internalAction({
  args: {
    recId: v.id("recordings"),
    transcript: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const inputs = await ctx.runQuery(
      internal.categorize.getUserAndTranscript,
      {
        recId: args.recId,
      }
    );
    const output = await categorize(args.transcript || inputs.transcript);
    switch (output.category) {
      case "reminder":
        await ctx.runMutation(internal.categorize.saveReminder, {
          userId: inputs.userId,
          recId: args.recId,
          when: output.when,
          text: output.text,
        });
        break;
      case "todo":
        await ctx.runMutation(internal.categorize.saveTodoList, {
          userId: inputs.userId,
          recId: args.recId,
          list: output.list,
          title: output.title,
          description: output.description,
        });
        break;
      case "journal":
        await ctx.runMutation(internal.categorize.saveJournal, {
          userId: inputs.userId,
          recId: args.recId,
          body: output.body,
          tweet: output.tweet,
          title: output.title,
        });
        break;
    }
  },
});

export const getUserAndTranscript = internalQuery({
  args: { recId: v.id("recordings") },
  handler: async (ctx, args) => {
    // get recording
    const recording = (await ctx.db.get(args.recId))!; // TODO: handle null
    // get transcript
    const transcription = await ctx.db
      .query("transcriptions")
      .filter((q) => q.eq(q.field("recordingId"), recording._id))
      .first();
    return {
      userId: recording.userId,
      transcript: transcription?.text || "",
    };
  },
});

export const saveReminder = internalMutation({
  args: {
    userId: v.string(),
    recId: v.id("recordings"),
    when: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("when", args.when);
    // parse the when string into a date
    const timestamp = Date.parse(args.when);
    // save the reminder
    ctx.db.insert("reminders", {
      userId: args.userId,
      recordingId: args.recId,
      when: timestamp,
      text: args.text,
    });
  },
});

export const saveTodoList = internalMutation({
  args: {
    userId: v.string(),
    recId: v.id("recordings"),
    title: v.string(),
    description: v.optional(v.string()),
    list: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // save the todo list
    ctx.db.insert("todoLists", {
      userId: args.userId,
      recordingId: args.recId,
      list: args.list,
      title: args.title,
      description: args.description,
    });
  },
});

export const saveJournal = internalMutation({
  args: {
    userId: v.string(),
    recId: v.id("recordings"),
    body: v.string(),
    tweet: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // save the journal
    ctx.db.insert("journal", {
      userId: args.userId,
      recordingId: args.recId,
      body: args.body,
      tweet: args.tweet,
      title: args.title,
    });
  },
});
