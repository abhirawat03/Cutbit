import mongoose from "mongoose";
import {Analytics} from "../models/analytics.js";
import {Url} from "../models/url.js";
import {calculateGrowth} from "../utils/growth.js"

export const getDashboardData = async(req,res)=>{
    const userId = req.user._id;
    const range = parseInt(req.query.range) || 7;
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - range)

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
                activeLinks:{
                    $sum:{
                        $cond:[{$eq:["status","active"]},1,0],
                    }
                },
                pausedLinks:{
                    $sum:{
                        $cond:[{$eq:["status","paused"]},1,0],
                    }
                },
                lifetimeClicks:{ $sum: "$totalClicks" },
                lifetimeUnique:{ $sum: "$totalUniqueVisitors" },
            }
        }
    ]);

    const total = totalStats[0] || {
        totalLinks:0,
        activeLinks:0,
        pausedLinks:0,
        lifetimeClicks:0,
        lifetimeUnique:0,
    }

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
        clicks:calculateGrowth(currentClicks,prevClicks),
        unique:calculateGrowth(currentUnique,prevUnique)
    }

    //chart data
    const chart = await Analytics.find({
        userId,
        date:{$gte:startDate,$lte:today},
    }).sort({date:1})
    .select("date clicks uniqueVisitors -_id");

    
}