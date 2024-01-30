import { QueryCtx } from "./_generated/server";

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
