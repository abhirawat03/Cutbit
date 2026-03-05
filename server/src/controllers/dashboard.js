import mongoose from "mongoose";
import {Analytics} from "../models/analytics.js";
import {Url} from "../models/url.js";
import {calculateGrowth} from "../utils/growth.js"
import {ApiError} from "../utils/ApiError.js"

export const getDashboardData = async(req,res)=>{
    try {
        const userId = req.user._id;
        const range = parseInt(req.query.range) || 7;
        const today = new Date();
        today.setHours(0,0,0,0)

        const endOfToday = new Date(today)
        endOfToday.setHours(23,59,59,999)

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (range - 1))
        // startDate.setHours(0,0,0,0)
    
        const prevStartDate = new Date();
        prevStartDate.setDate(startDate.getDate() - range);
    
        const objectUserId = new mongoose.Types.ObjectId(userId);
    
        //Link totals (single aggraegation)
        const totalStats = await Url.aggregate([
            {
                $match:{userId:objectUserId}
            },
            {
                $group:{
                    _id:null,
                    totalLinks: {$sum:1},
                    // activeLinks:{
                    //     $sum:{
                    //         $cond:[{$eq:["status","active"]},1,0],
                    //     }
                    // },
                    // pausedLinks:{
                    //     $sum:{
                    //         $cond:[{$eq:["status","paused"]},1,0],
                    //     }
                    // },
                    lifetimeClicks:{ $sum: "$totalClicks" },
                    lifetimeUnique:{ $sum: "$totalUniqueVisitors" },
                }
            }
        ]);
    
        const stats = totalStats[0] || {
            totalLinks:0,
            // activeLinks:0,
            // pausedLinks:0,
            lifetimeClicks:0,
            lifetimeUnique:0,
        }
        console.log("Start:", startDate)
console.log("End:", endOfToday)
    
        //current range stats
    
        const currentStats = await Analytics.aggregate([
            {
                $match:{
                    userId:objectUserId,
                    date:{
                        $gte:startDate,
                        $lte:today,
                    },
                },
            },
            {
                $group:{
                    _id:null,
                    clicks:{$sum:"$clicks"},
                    unique:{$sum:"$uniqueVisitors"}
                },
            },
        ])
    
        const currentClicks = currentStats[0]?.clicks || 0;
        const currentUnique = currentStats[0]?.unique || 0;
    
        //previous Range stats
        const previousStats = await Analytics.aggregate([
            {
                $match:{
                    userId:objectUserId,
                    date:{
                        $gte:prevStartDate,
                        $lt:startDate
                    },
                },
            },
            {
                $group:{
                    _id:null,
                    clicks:{$sum:"$clicks"},
                    unique:{$sum:"$uniqueVisitors"}
                },
            },
        ])
        const prevClicks = previousStats[0]?.clicks || 0;
        const prevUnique = previousStats[0]?.unique || 0;
    
        const growth = {
            clicks:calculateGrowth(currentClicks,prevClicks) || 0,
            unique:calculateGrowth(currentUnique,prevUnique) || 0
        }
    
        //chart data
        const analytics = await Analytics.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endOfToday },
    })
      .sort({ date: 1 })
      .select("date clicks uniqueVisitors -_id")
    console.log("Analytics docs:", analytics)
    console.log(await Analytics.find())
    // Create full date range
    const dates = []
    const current = new Date(startDate)

    while (current <= endOfToday) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    // Convert analytics to map
    const analyticsMap = new Map()

    analytics.forEach((item) => {
      const key = item.date.toLocaleDateString("en-CA")

      analyticsMap.set(key, {
        clicks: item.clicks,
        uniqueVisitors: item.uniqueVisitors,
      })
    })

    // Fill missing days
    const chart = dates.map((date) => {
      const key = date.toLocaleDateString("en-CA")

      return {
        date: key,
        clicks: analyticsMap.get(key)?.clicks || 0,
        uniqueVisitors: analyticsMap.get(key)?.uniqueVisitors || 0,
      }
    })
    
        // TOP PERFORMING LINK
        const topLink = await Analytics.aggregate([
            {
                $match: {
                    userId: objectUserId,
                    date: { $gte: startDate, $lte: today },
                },
            },
            {
                $group: {
                    _id: "$urlId",
                    clicks: { $sum: "$clicks" },
                    uniqueVisitors: { $sum: "$uniqueVisitors" },
                },
            },
            { $sort: { clicks: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "urls",
                    localField: "_id",
                    foreignField: "_id",
                    as: "url",
                },
            },
            { $unwind: "$url" },
            {
                $project: {
                    shortUrl: "$url.shortUrl",
                    originalUrl: "$url.originalUrl",
                    name: "$url.name",
                    clicks: 1,
                    uniqueVisitors: 1,
                },
            },
        ]);
    
        // RECENT LINKS
        const recentLinks = await Url.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("shortUrl originalUrl name totalClicks status");
    
        return res.status(200).json({
            success: true,
            data: {
                stats,
                growth,
                chart,
                topLink: topLink[0] || null,
                recentLinks
            }
        });
    } catch (error) {
        throw new ApiError(500,"Failed to load dashboard")
    }
}