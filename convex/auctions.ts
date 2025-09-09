import { v } from 'convex/values'
import {mutation, query} from './_generated/server'

export const getAllAuctions = query({
    args:{},
    handler: async (ctx)=>{
        return await ctx.db.query("auctions").collect()
    }
})
export const createAuction = mutation({
    args:{productId: v.id("products"),ownerId: v.id("users")},
    handler: async (ctx,args)=>{
        ctx.db.insert("auctions",{
            endTime:"",
            imagesUrl:[],
            usersId:[],
            ownerId: args.ownerId,
            productId:args.productId,
            startTime:"",
            bids:[]
        })
    }
})
export const placeBid = mutation({
    args: {auctionId: v.id("auctions"), bidderName: v.string(), bidderPrice:v.number()},
    handler: async(ctx, args) =>{
        const auction = await ctx.db.get(args.auctionId);
        if (!auction) {
            return
        }
        const newBids = auction.bids
        newBids.push({bidderName: args.bidderName, price: args.bidderPrice})
        await ctx.db.patch(args.auctionId,{
            bids: newBids
        })
    },
})
export const getAuction = query({
    args: {auctionId: v.optional(v.id("auctions"))},
    handler: async (ctx,args)=>{
        if (!args.auctionId) {
            return
        }
        const auction = await ctx.db.get(args.auctionId);
        if(!auction){
            return
        }
        const product = await ctx.db.get(auction?.productId)
        return {
            ...auction,
            product:{
                images: product?.images,
                name: product?.name,
                start_price: product?.start_price,
                totalusers: auction.usersId.length
            }
        }
    }
})