import { Url } from "../models/url.js";
import { nanoid } from "nanoid";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { validateAlias } from "../utils/validateAlias.js";
import { Analytics } from "../models/analytics.js";
import { Visitor } from "../models/visitor.js";
import { calculateGrowth } from "../utils/growth.js";
import { getCache, setCache, clearCacheByPrefix } from "../utils/cache.js";

const validateProductionUrl = async(url) => {
  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    throw new ApiError(400, "Invalid URL format");
  }

  // only allow http/https
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new ApiError(400, "Only HTTP/HTTPS URLs allowed");
  }

  const hostname = parsed.hostname.toLowerCase();

  // block obvious bad ones
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0"
  ) {
    throw new ApiError(400, "Local URLs are not allowed");
  }

  return parsed.toString();
};

const createShortUrl = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "unauthorized");
    const { name, originalUrl, customAlias, expiryDate } = req.body;

    if (!originalUrl) throw new ApiError(400, "Url required");

    // ✅ URL validation
    const normalizedUrl = await validateProductionUrl(originalUrl)

    let shortUrl;

    // If user provided alias
    if (customAlias) {
    shortUrl = validateAlias(customAlias);
  } else {
    let exists;
    do {
      shortUrl = nanoid(6);
      exists = await Url.findOne({ shortUrl });
    } while (exists);
  }

  // ✅ expiry validation
  let validExpiry = null;
  if (expiryDate) {
    const date = new Date(expiryDate);

    if (isNaN(date)) throw new ApiError(400, "Invalid expiry date");
    if (date <= new Date()) throw new ApiError(400, "Expiry must be future");

    validExpiry = date;
  }

    try {
      const newUrl = await Url.create({
        userId,
        name:name?.trim() || "",
        originalUrl:normalizedUrl,
        shortUrl,
        ...(validExpiry && { expiryDate: validExpiry }),
      });
      clearCacheByPrefix(`dashboard:${userId}`);
      clearCacheByPrefix(`links:${userId}`);
      clearCacheByPrefix(`stats:${userId}`);
      return res
        .status(201)
        .json(new ApiResponse(201, newUrl, "Shorturl created successfully"));
    } catch (err) {
      if (err.code === 11000) {
        throw new ApiError(400, "Custom alias already exists");
      }
      throw err;
    }
    
};

const getalllinks = async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(401, "unauthorized");

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const cacheKey = `links:${userId}:${page}:${limit}`;
  const cached = getCache(cacheKey);

  if (cached) {
    return res.json(new ApiResponse(200, cached, "Cached links"));
  }

  const result = await Url.aggregate([
    {
      $match: { userId:new mongoose.Types.ObjectId(userId) },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        links: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const links = result[0].links;
  const totalLinks = result[0].totalCount[0]?.count || 0;

  const responseData = {
    links,
    pagination: {
      totalLinks,
      page,
      totalPages: Math.max(Math.ceil(totalLinks / limit), 1),
    },
  };

  setCache(cacheKey, responseData, 60000);

  return res.status(200).json(
    new ApiResponse(
      200,
      responseData,
      "Links fetched successfully",
    ),
  );
};

const getlink = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "unauthorized");
  const { linkId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(linkId))
    throw new ApiError(400, "Invalid id");

  const link = await Url.findOne({
    userId,
    _id: linkId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, link, "Link fetched successfully"));
};

const updateLink = async (req, res) => {
  const { linkId } = req.params;
  const userId = req.user._id;
  if (!userId) throw new ApiError(401, "unauthorized");

  const { originalUrl, shortUrl, expiryDate, status } = req.body;
  const updateFields = {};
  // original url
  if (originalUrl) {
    // ✅ URL validation
    try {
      await validateProductionUrl(originalUrl)
    } catch {
      throw new ApiError(400, "Invalid URL format");
    }
  }

  if (shortUrl) {
    const normalizedAlias = validateAlias(shortUrl);
    const existing = await Url.findOne({ shortUrl: normalizedAlias });

    if (existing && existing._id.toString() !== linkId) {
      throw new ApiError(400, "Alias already taken");
    }
    updateFields.shortUrl = normalizedAlias;
  }

  if (expiryDate !== undefined) {
    if (new Date(expiryDate) <= new Date()) {
      throw new ApiError(400, "Expiry date must be in the future");
    }
    updateFields.expiryDate = expiryDate;
  }

  // status validation
  if (status) {
    const allowedStatus = ["active", "paused"];

    if (!allowedStatus.includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    updateFields.status = status;
  }

  const link = await Url.findOneAndUpdate(
    { _id: linkId, userId },
    { $set: updateFields },
    { new: true },
  );
  if (!link) {
    throw new ApiError(404, "Link not found");
  }

  clearCacheByPrefix(`links:${userId}`);
  clearCacheByPrefix(`stats:${userId}`);
  clearCacheByPrefix(`analytics:${linkId}`);
  clearCacheByPrefix(`dashboard:${userId}`);

  return res
    .status(200)
    .json(new ApiResponse(200, link, "Link updated successfully"));
};

const deleteLink = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const { linkId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(linkId))
    throw new ApiError(400, "Invalid id");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const link = await Url.findOneAndDelete({
      _id: linkId,
      userId,
    },{ session });
    if (!link) throw new ApiError(404, "Link not found");
    // delete related analytics
    await Analytics.deleteMany({ urlId: linkId }).session(session);
  
    // delete visitor records
    await Visitor.deleteMany({ urlId: linkId }).session(session);
  
    await session.commitTransaction();
    session.endSession();

    clearCacheByPrefix(`dashboard:${userId}`);
    clearCacheByPrefix(`links:${userId}`);
    clearCacheByPrefix(`stats:${userId}`);
    clearCacheByPrefix(`analytics:${linkId}`);
    
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Link deleted successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getstats = async (req, res) => {
  const userId = req.user._id;
  const cacheKey = `stats:${userId}`;
  const cached = getCache(cacheKey);

  if (cached) {
    return res.json(new ApiResponse(200, cached, "Cached stats"));
  }

  const stats = await Url.aggregate([
    {
      $match: { userId:new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: null,
        totalLinks: { $sum: 1 },
        totalClicks: {
          $sum: "$totalClicks",
        },
        totalActive: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$status", "active"] },
                  {
                    $or: [
                      { $eq: ["$expiryDate", null] },
                      { $gt: ["$expiryDate", new Date()] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const data = stats[0] || {
    totalLinks: 0,
    totalClicks: 0,
    totalActive: 0,
  };

  setCache(cacheKey, data, 60000);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Links stats fetched successfully"));
};

const getLinkAnalytics = async (req, res) => {
  const { linkId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    throw new ApiError(400, "Invalid id");
  }

  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const allowedRanges = [7, 30];
  let range = parseInt(req.query.range) || 7;
  if (!allowedRanges.includes(range)) range = 7;

  // ✅ cache key
  const cacheKey = `analytics:${linkId}:${range}`;

  // ✅ check cache
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(new ApiResponse(200, cached, "Cached analytics"));
  }

  const tz = "Asia/Kolkata";

  const now = new Date();
  const today = new Date(
    now.toLocaleString("en-US", { timeZone: tz })
  );

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (range - 1));

  const previousStart = new Date(startDate);
  previousStart.setDate(previousStart.getDate() - range);

  const previousEnd = new Date(startDate);
  previousEnd.setDate(previousEnd.getDate() - 1);

  const objectUserId = new mongoose.Types.ObjectId(userId);
  const objectLinkId = new mongoose.Types.ObjectId(linkId);

  // ✅ Fetch link (lean = faster)
  const link = await Url.findOne({
    _id: linkId,
    userId,
  })
    .select("shortUrl originalUrl totalClicks totalUniqueVisitors")
    .lean();

  if (!link) throw new ApiError(404, "Link not found");

  // ✅ SINGLE aggregation (daily + current + previous)
  const [analyticsResult] = await Analytics.aggregate([
    {
      $match: {
        urlId: objectLinkId,
        userId: objectUserId,
      },
    },
    {
      $facet: {
        daily: [
          { $match: { date: { $gte: startDate, $lte: endOfToday } } },
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
        current: [
          { $match: { date: { $gte: startDate } } },
          {
            $group: {
              _id: null,
              clicks: { $sum: "$clicks" },
              uniqueVisitors: { $sum: "$uniqueVisitors" },
            },
          },
        ],
        previous: [
          {
            $match: {
              date: { $gte: previousStart, $lte: previousEnd },
            },
          },
          {
            $group: {
              _id: null,
              clicks: { $sum: "$clicks" },
              uniqueVisitors: { $sum: "$uniqueVisitors" },
            },
          },
        ],
        stats: [
          { $match: { date: { $gte: startDate } } },
          {
            $group: {
              _id: null,
              deviceStats: { $push: "$deviceStats" },
              countryStats: { $push: "$countryStats" },
              referrerStats: { $push: "$referrerStats" },
            },
          },
        ],
      },
    },
  ]);

  // ✅ Extract results
  const daily = analyticsResult.daily || [];
  const current = analyticsResult.current[0] || {
    clicks: 0,
    uniqueVisitors: 0,
  };
  const previous = analyticsResult.previous[0] || {
    clicks: 0,
    uniqueVisitors: 0,
  };
  const stats = analyticsResult.stats[0] || {};

  // ✅ Growth
  const clickGrowth = calculateGrowth(current.clicks, previous.clicks) || 0;
  const uniqueGrowth =
    calculateGrowth(current.uniqueVisitors, previous.uniqueVisitors) || 0;

  // ✅ Convert daily to map
  const analyticsMap = new Map();
  daily.forEach((item) => {
    analyticsMap.set(item._id, {
      clicks: item.clicks,
      uniqueVisitors: item.uniqueVisitors,
    });
  });

  // ✅ Fill missing days
  const chartData = [];

  for (let i = range - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);

    const key = d.toLocaleDateString("en-CA", { timeZone: tz });

    chartData.push({
      date: key,
      clicks: analyticsMap.get(key)?.clicks || 0,
      uniqueVisitors: analyticsMap.get(key)?.uniqueVisitors || 0,
    });
  }

  // ✅ Helper to merge stats arrays
  const mergeStats = (arr = []) => {
    const result = {};
    for (const obj of arr) {
      for (const [k, v] of Object.entries(obj || {})) {
        result[k] = (result[k] || 0) + v;
      }
    }
    return result;
  };

  const deviceStats = mergeStats(stats.deviceStats);
  const countryStats = mergeStats(stats.countryStats);
  const referrerStats = mergeStats(stats.referrerStats);

  const responseData = {
    shortUrl: link.shortUrl,
    originalUrl: link.originalUrl,
    totalClicks: link.totalClicks,
    totalUniqueVisitors: link.totalUniqueVisitors,
    clickGrowth,
    uniqueGrowth,
    chartData,
    deviceStats,
    countryStats,
    referrerStats,
  };

  // ✅ cache result (60 sec)
  setCache(cacheKey, responseData, 60000);

  return res.json(
    new ApiResponse(
      200,
      responseData,
      "Link analytics fetched successfully"
    )
  );
};

export {
  createShortUrl,
  getalllinks,
  getlink,
  getstats,
  updateLink,
  deleteLink,
  getLinkAnalytics,
};
