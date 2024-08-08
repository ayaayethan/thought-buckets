import { v, VBoolean } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentBucket: v.optional(v.id("buckets"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const bucket = await ctx.db.insert("buckets", {
      title: args.title,
      parentBucket: args.parentBucket,
      userId,
      isArchived: false,
      isPublished: false
    })
  }
})