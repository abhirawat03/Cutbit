import { Url } from "../models/url.js";
import { nanoid } from "nanoid";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { validateAlias } from "../utils/validateAlias.js";
import { Analytics } from "../models/analytics.js";
import { Visitor } from "../models/visitor.js";
import { calculateGrowth } from "../utils/growth.js";

const validateProductionUrl = async (url) => {
  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    throw new ApiError(400, "Invalid URL format");
  }

  // ✅ protocol check
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new ApiError(400, "Only HTTP/HTTPS URLs allowed");
  }

  const hostname = parsed.hostname;

  // ❌ block internal/private hosts
  const isLocal =
    hostname === "localhost" ||
    hostname.startsWith("127.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("192.168.");

  if (isLocal) {
    throw new ApiError(400, "Invalid target URL");
  }

  // ⚡ optional DNS check
  try {
    await dns.lookup(hostname);
  } catch {
    throw new ApiError(400, "Domain does not exist");
  }

  return parsed.href;
};

const createShortUrl = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "unauthorized");
  const { name, originalUrl, customAlias, expiryDate } = req.body;

  if (!originalUrl) throw new ApiError(400, "Url required");

  // ✅ URL validation
  try {
    await validateProductionUrl(originalUrl)
  } catch {
    throw new ApiError(400, "Invalid URL format");
  }

  let shortUrl;

  // If user provided alias
  if (customAlias) {
    shortUrl = validateAlias(customAlias);
  } else {
    shortUrl = nanoid(6);
  }

  try {
    const newUrl = await Url.create({
      userId,
      name,
      originalUrl,
      shortUrl,
      ...(expiryDate && { expiryDate }), //optional
    });
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        links,
        pagination: {
          totalLinks,
          page,
          totalPages: Math.max(Math.ceil(totalLinks / limit), 1),
        },
      },
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

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Links stats fetched successfully"));
};

const getLinkAnalytics = async (req, res) => {
  const { linkId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(linkId))
    throw new ApiError(400, "Invalid id");

  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const allowedRanges = [7, 30];
  let range = parseInt(req.query.range) || 7;

  if (!allowedRanges.includes(range)) range = 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (range - 1));

  const previousStart = new Date(startDate);
  previousStart.setDate(previousStart.getDate() - range);

  const previousEnd = new Date(startDate);
  previousEnd.setDate(previousEnd.getDate() - 1);

  const objectUserId = new mongoose.Types.ObjectId(userId);
  const objectLinkId = new mongoose.Types.ObjectId(linkId);

  // Fetch link
  const link = await Url.findOne({
    _id: linkId,
    userId,
  })
    .select("shortUrl originalUrl totalClicks totalUniqueVisitors")
    .lean();

  if (!link) throw new ApiError(404, "Link not found");

  // DAILY ANALYTICS (aggregation)
  const analytics = await Analytics.aggregate([
    {
      $match: {
        urlId: objectLinkId,
        userId: objectUserId,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kolkata"
          }
        },
        clicks: { $sum: "$clicks" },
        uniqueVisitors: { $sum: "$uniqueVisitors" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Previous period analytics
  const previousStats = await Analytics.aggregate([
    {
      $match: {
        urlId: objectLinkId,
        userId: objectUserId,
        date: { $gte: previousStart, $lte: previousEnd }
      }
    },
    {
      $group: {
        _id: null,
        clicks: { $sum: "$clicks" },
        uniqueVisitors: { $sum: "$uniqueVisitors" }
      }
    }
  ]);

  const previousClicks = previousStats[0]?.clicks || 0;
  const previousUnique = previousStats[0]?.uniqueVisitors || 0;

  const currentClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
  const currentUnique = analytics.reduce((sum, a) => sum + a.uniqueVisitors, 0);

  const clickGrowth = calculateGrowth(currentClicks, previousClicks) || 0;
  const uniqueGrowth = calculateGrowth(currentUnique, previousUnique) || 0;

  // Convert analytics to map
  const analyticsMap = new Map();

  analytics.forEach((item) => {
    analyticsMap.set(item._id, {
      clicks: item.clicks,
      uniqueVisitors: item.uniqueVisitors
    });
  });

  // Fill missing days
  const chartData = [];

  for (let i = range - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);

    const key = d.toLocaleDateString("en-CA");

    chartData.push({
      date: key,
      clicks: analyticsMap.get(key)?.clicks || 0,
      uniqueVisitors: analyticsMap.get(key)?.uniqueVisitors || 0
    });
  }

  // Device / Country / Referrer stats
  const rawStats = await Analytics.find({
    urlId: linkId,
    userId,
    date: { $gte: startDate }
  }).lean();

  const deviceStats = {};
  const countryStats = {};
  const referrerStats = {};

  for (const a of rawStats) {
    for (const [k, v] of Object.entries(a.deviceStats || {})) {
      deviceStats[k] = (deviceStats[k] || 0) + v;
    }

    for (const [k, v] of Object.entries(a.countryStats || {})) {
      countryStats[k] = (countryStats[k] || 0) + v;
    }

    for (const [k, v] of Object.entries(a.referrerStats || {})) {
      referrerStats[k] = (referrerStats[k] || 0) + v;
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        shortUrl: link.shortUrl,
        originalUrl: link.originalUrl,
        totalClicks: link.totalClicks,
        totalUniqueVisitors: link.totalUniqueVisitors,
        clickGrowth,
        uniqueGrowth,
        chartData,
        deviceStats,
        countryStats,
        referrerStats
      },
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
