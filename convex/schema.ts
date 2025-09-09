import {defineTable, defineSchema} from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
    ...authTables,
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
    products: defineTable({
        name: v.string(),
        auctionId: v.optional(v.id("auctions")),
        start_price: v.number(),
        images: v.array(v.string()),
        userId: v.id("users")
    }),
    auctions: defineTable({
        ownerId: v.id("users"),
        imagesUrl: v.array(v.string()),
        productId: v.id("products"),
        startTime: v.string(),
        endTime: v.string(),
        usersId: v.array(v.id("users")),
        bids: v.array(v.object({
            price: v.number(),
            bidderName: v.string(),
        }))
    }),
})