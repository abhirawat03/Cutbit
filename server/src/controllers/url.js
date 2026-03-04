import { Url } from "../models/url.js";
import { nanoid } from "nanoid";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createShortUrl = async (req, res) => {
    const userId = req.user?._id;
    const { name, originalUrl, customAlias, expiryDate } = req.body;

        if (!originalUrl) throw new ApiError(400, "Url required");

        // let shortUrl = customAlias ? customAlias.trim().toLowerCase() : nanoid(6);
    let shortUrl;

        // If user provided alias
    if (customAlias) {
        shortUrl = customAlias.trim().toLowerCase();

        const existing = await Url.findOne({ shortUrl });

        if (existing) {
            throw new ApiError(400, "Custom alias already exists");
        }
    } else {
      shortUrl = nanoid(6);
    }

    

  // const shortUrl = nanoid(6);
  const newUrl = await Url.create({
    userId,
    name,
    originalUrl,
    shortUrl,
    ...(expiryDate && { expiryDate })    //optional
  });

  if (!newUrl) throw new ApiError(404, "custom alias already exist");

  return res.status(201).json(
    new ApiResponse(
      201,
      newUrl,
      // `http://localhost:8000/${shortUrl}`,
      "Shorturl created successfully",
    ),
  );
};

const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;

  if (!shortUrl) throw new ApiError(400, "Invalid shorturl");

  const url = await Url.findOneAndUpdate(
    { shortUrl: shortUrl },
    { $inc: { clicks: 1 } },
    // {new:true}
  );

  if (!url) throw new ApiError(404, "short url not found");

  res.redirect(url.originalUrl);

  // return res
  // .status(200)
  // .json(
  //     new ApiResponse(
  //         200,
  //         url,
  //         "Successfully redirect to the url"
  //     )
  // )
};

const getalllinks = async (req, res) => {
  const userId = req.user._id;
  if (!userId) throw new ApiError(401, "unauthorized");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Url.aggregate([
    {
      $match: { userId },
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

const updateLink = async (req, res) => {
  const { linkId } = req.params;
  const userId = req.user._id;
  if (!userId) throw new ApiError(401, "unauthorized");

  const { originalUrl, shortUrl, expiryDate, status } = req.body;
  if (shortUrl) {
    const existing = await Url.findOne({ shortUrl });

    if (existing && existing._id.toString() !== linkId) {
      throw new ApiError(400, "Alias already taken");
    }
  }

  if (expiryDate && new Date(expiryDate) < new Date()) {
    throw new ApiError(400, "Expiry date must be in the future");
  }

  const updateFields = {};
  if (originalUrl) updateFields.originalUrl = originalUrl;
  if (shortUrl) updateFields.shortUrl = shortUrl;
  if (expiryDate) updateFields.expiryDate = expiryDate;
  if (status) updateFields.status = status;

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
  const { linkId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(linkId))
    throw new ApiError(400, "Invalid id");

  const link = await Url.findOneAndDelete({
    _id: linkId,
    userId,
  });
  if (!link) throw new ApiError(404, "Link not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Link deleted successfully"));
};

const getstats = async (req, res) => {
  const userId = req.user._id;

  const stats = await Url.aggregate([
    {
      $match: { userId },
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
            $cond: [{ $eq: ["$status", "active"] }, 1, 0],
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

export {
  createShortUrl,
  redirectUrl,
  getalllinks,
  getstats,
  updateLink,
  deleteLink,
};
