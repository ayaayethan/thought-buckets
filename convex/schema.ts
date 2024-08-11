import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  buckets: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentBucket: v.optional(v.id("buckets")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean()
  })
  .index("by_user", [ "userId" ])
  .index("by_user_parent", [ "userId", "parentBucket" ])
})