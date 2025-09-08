import {defineTable, defineSchema} from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
    ...authTables,
    products: defineTable({
        // id: v.id("products"),
        name: v.string(),
        userId: v.id("users")
    }),
    auctions: defineTable({
        // id: v.id("auctions"),
        imagesUrl: v.array(v.string()),
        productId: v.id("products"),
        startTime: v.string(),
        endTime: v.string(),
        usersId: v.array(v.id("users"))
    }),
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        // other "users" fields...
    }).index("email", ["email"]),
})