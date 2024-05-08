import { mutation, QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";
import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";

export async function checkAuth(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Unauthenticated call");
  }
  return identity;
}

export function idFromTokenIdentifier(tokenIdentifier: string) {
  return tokenIdentifier.split("|")[1];
}

// Use `userQuery` instead of `query` to add this behavior.
export const appQueryWithAuth = customQuery(
  query, // The base function we're extending
  // Here we're using a `customCtx` helper because our modification
  // only modifies the `ctx` argument to the function.
  {
    args: {},
    input: async (ctx, _args) => {
      const identity = await checkAuth(ctx);
      const userId = idFromTokenIdentifier(identity.tokenIdentifier);
      return { ctx: { userId }, args: {} };
    },
  }
);

// Use `userQuery` instead of `query` to add this behavior.
export const appMutationWithAuth = customMutation(
  mutation, // The base function we're extending
  // Here we're using a `customCtx` helper because our modification
  // only modifies the `ctx` argument to the function.
  {
    args: {},
    input: async (ctx, _args) => {
      const identity = await checkAuth(ctx);
      const userId = idFromTokenIdentifier(identity.tokenIdentifier);
      return { ctx: { userId }, args: {} };
    },
  }
);
