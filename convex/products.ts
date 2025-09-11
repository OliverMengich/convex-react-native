import {query, mutation} from './_generated/server'
import { v } from "convex/values";

export const getAllProducts = query({
    args:{},
    handler: async (ctx)=>{
        const allProducts =  await ctx.db.query("products").collect()
        return await Promise.all(allProducts.map(async p=>({
            ...p,
            images: [await ctx.storage.getUrl(p.images[0]), ...p.images]
        })))
    }
})
export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});
export const createProduct = mutation({
    args: {name: v.string(), start_price: v.number(),images: v.array(v.id("_storage")), userId: v.id("users"),  },
    handler: async (ctx, args) => {
        await ctx.db.insert("products", {
            start_price: args.start_price,
            images: args.images,
            name: args.name,
            userId: args.userId
        });
    },
});
