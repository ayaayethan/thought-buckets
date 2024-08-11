import { v, VBoolean } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { exit } from "process";

export const archive = mutation({
  args: {
    id: v.id("buckets")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingBucket = await ctx.db.get(args.id);

    if (!existingBucket) {
      throw new Error("Not found");
    }

    if (existingBucket.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (bucketId: Id<"buckets">) => {
      const children = await ctx.db
        .query("buckets")
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentBucket", bucketId)
        ))
        .collect();

        for (const child of children) {
          await ctx.db.patch(child._id, {
            isArchived: true
          })

          await recursiveArchive(child._id);
        }
    }

    const bucket = await ctx.db.patch(args.id, {
      isArchived: true
    })

    recursiveArchive(args.id);

    return bucket;
  }
})

export const getSidebar = query({
  args: {
    parentBucket: v.optional(v.id("buckets"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const buckets = await ctx.db
    .query("buckets")
    .withIndex("by_user_parent", (q) =>
      q
        .eq("userId", userId)
        .eq("parentBucket", args.parentBucket)
    )
    .filter((q) =>
      q.eq(q.field("isArchived"), false)
    )
    .order("desc")
    .collect();

    return buckets;
  }
})

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

    return bucket;
  }
})

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const buckets = await ctx.db
      .query("buckets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("isArchived"), true)
      )
      .order("desc")
      .collect();

      return buckets;
  }
})

export const restore = mutation({
  args: { id: v.id("buckets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingBucket = await ctx.db.get(args.id);

    if (!existingBucket) {
      throw new Error("Not found");
    }

    if (existingBucket.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (bucketId: Id<"buckets">) => {
      const children = await ctx.db
        .query("buckets")
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentBucket", bucketId)
        ))
        .collect();

        for (const child of children) {
          await ctx.db.patch(child._id, {
            isArchived: false
          })

          await recursiveRestore(child._id);
        }
    }

    const options: Partial<Doc<"buckets">> = {
      isArchived: false
    }

    if (existingBucket.parentBucket) {
      const parent = await ctx.db.get(existingBucket.parentBucket);

      if (parent?.isArchived) {
        options.parentBucket = undefined;
      }
    }

    const bucket = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return bucket;
  }
})

export const remove = mutation({
  args: { id: v.id("buckets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingBucket = await ctx.db.get(args.id);

    if (!existingBucket) {
      throw new Error("Not found")
    }

    if (existingBucket.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const bucket = await ctx.db.delete(args.id);

    return bucket;
  }
})

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const buckets = await ctx.db
      .query("buckets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => (
        q.eq(q.field("isArchived"), false)
      ))
      .order("desc")
      .collect();

    return buckets;
  }
})

export const getById = query({
  args: { bucketId: v.id("buckets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const bucket = await ctx.db.get(args.bucketId);

    if (!bucket) {
      throw new Error("Not found");
    }

    if (bucket.isPublished && !bucket.isArchived) {
      return bucket;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (bucket.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return bucket;
  }
})

export const update = mutation({
  args: {
    id: v.id("buckets"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingBucket = await ctx.db.get(args.id);

    if (!existingBucket) {
      throw new Error("not found");
    }

    if (existingBucket.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const bucket = await ctx.db.patch(args.id, {
      ...rest
    })

    return bucket;
  }
})

export const removeIcon = mutation({
  args: { id: v.id("buckets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingBucket = await ctx.db.get(args.id);

    if (!existingBucket) {
      throw new Error("Not found");
    }

    if (existingBucket.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const bucket = await ctx.db.patch(args.id, {
      icon: undefined
    });

    return bucket;
  }
})

export const removeCoverImage = mutation({
  args: { id: v.id("buckets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingBucket = await ctx.db.get(args.id);

    if (!existingBucket) {
      throw new Error("Not found");
    }

    if (existingBucket.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const bucket = await ctx.db.patch(args.id, {
      coverImage: undefined
    })

    return bucket;
  }
})