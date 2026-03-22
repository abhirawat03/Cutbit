import mongoose from "mongoose";
import { Analytics } from "../models/analytics.js";
import { Url } from "../models/url.js";
import { calculateGrowth } from "../utils/growth.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCache, setCache } from "../utils/cache.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const allowedRanges = [7, 30];
    let range = Number(req.query.range) || 7;
    if (!allowedRanges.includes(range)) {
      range = 7;
    }
    const cacheKey = `dashboard:${userId}-${range}`;
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json(new ApiResponse(200, cached, "Cached dashboard"));
    }

    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (range - 1));

    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - range);

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // 🚀 combine analytics queries using $facet
    const [analyticsData, totalStats, recentLinks] = await Promise.all([
      Analytics.aggregate([
        {
          $match: {
            userId: objectUserId,
            date: { $gte: prevStartDate, $lte: endOfToday },
          },
        },
        {
          $facet: {
            currentStats: [
              {
                $match: {
                  date: { $gte: startDate, $lte: endOfToday },
                },
              },
              {
                $group: {
                  _id: null,
                  clicks: { $sum: "$clicks" },
                  unique: { $sum: "$uniqueVisitors" },
                },
              },
            ],

            previousStats: [
              {
                $match: {
                  date: { $gte: prevStartDate, $lt: startDate },
                },
              },
              {
                $group: {
                  _id: null,
                  clicks: { $sum: "$clicks" },
                  unique: { $sum: "$uniqueVisitors" },
                },
              },
            ],

            chart: [
              {
                $match: {
                  date: { $gte: startDate, $lte: endOfToday },
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$date",
                      timezone: "Asia/Kolkata",
                    },
                  },
                  clicks: { $sum: "$clicks" },
                  uniqueVisitors: { $sum: "$uniqueVisitors" },
                },
              },
              { $sort: { _id: 1 } },
            ],

            topLink: [
              {
                $match: {
                  userId: objectUserId,
                  date: { $gte: startDate, $lte: endOfToday },
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
            ],
          },
        },
      ]),

      // total stats (separate — different collection)
      Url.aggregate([
        { $match: { userId: objectUserId } },
        {
          $group: {
            _id: null,
            totalLinks: { $sum: 1 },
            lifetimeClicks: { $sum: "$totalClicks" },
            lifetimeUnique: { $sum: "$totalUniqueVisitors" },
          },
        },
      ]),

      Url.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("shortUrl originalUrl name totalClicks status")
        .lean(),
    ]);

    const facet = analyticsData[0];

    const currentStats = facet.currentStats[0] || {};
    const previousStats = facet.previousStats[0] || {};
    const analytics = facet.chart || [];
    const topLink = facet.topLink[0] || null;

    const stats = totalStats[0] || {
      totalLinks: 0,
      lifetimeClicks: 0,
      lifetimeUnique: 0,
    };

    const growth = {
      clicks: calculateGrowth(
        currentStats.clicks || 0,
        previousStats.clicks || 0,
      ),
      unique: calculateGrowth(
        currentStats.unique || 0,
        previousStats.unique || 0,
      ),
    };

    // 📊 chart build (still fine)
    const dates = [];
    const current = new Date(startDate);

    while (current <= endOfToday) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const analyticsMap = new Map();
    analytics.forEach((item) => {
      analyticsMap.set(item._id, item);
    });

    const chart = dates.map((date) => {
      const key = d.toISOString().slice(0, 10);
      return {
        date: key,
        clicks: analyticsMap.get(key)?.clicks || 0,
        uniqueVisitors: analyticsMap.get(key)?.uniqueVisitors || 0,
      };
    });

    const data = {
      stats,
      growth,
      chart,
      topLink,
      recentLinks,
    };

    setCache(cacheKey, data, 60000);

    return res.json(
      new ApiResponse(200, data, "Dashboard data fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to load dashboard");
  }
};
