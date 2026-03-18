import { Url } from "../models/url.js";
import crypto from "crypto";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { Visitor } from "../models/visitor.js";
import { Analytics } from "../models/analytics.js";
import { ApiError } from "../utils/ApiError.js";

const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;

  if (!shortUrl) throw new ApiError(400, "Invalid shorturl");

  // find link
  const url = await Url.findOne({ shortUrl }).lean();

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!url) {
    return res.redirect(`${FRONTEND_URL}/link-error/invalid`);
  }

  if (!url.userId) {
    throw new ApiError(500, "Corrupted URL data");
  }

  if (url.status === "paused") {
    return res.redirect(`${FRONTEND_URL}/link-error/paused`);
  }

  if (url.expiryDate && url.expiryDate < new Date()) {
    return res.redirect(`${FRONTEND_URL}/link-error/expired`);
  }

  //check visitor
  let visitorId = req.cookies?.visitorId;

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    res.cookie("visitorId", visitorId, {
      maxAge: 31536000000, // 1 year
      httpOnly: true,
    });
  }

  //date normalization
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //device detection
  const userAgent = req.headers["user-agent"] || "";

  const botRegex =
    /bot|crawl|spider|slurp|facebookexternalhit|twitterbot|slackbot|discordbot/i;

  const isBot = botRegex.test(userAgent);

  let device = "other";

  if (isBot) {
    device = "bot";
  } else {
    const parser = new UAParser(userAgent);
    const type = parser.getDevice().type;

    if (type === "mobile") device = "mobile";
    else if (type === "tablet") device = "tablet";
    else device = "desktop";
  }

  //country detection
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    req.ip||
    "0.0.0.0";

  const geo = geoip.lookup(ip);

  const country = geo?.country || "Unknown";

  //ip hash
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  // UNIQUE VISITOR CHECK
  let referrer = "Direct";

  try {
    if (req.headers.referer) {
      referrer = new URL(req.headers.referer).hostname;
    }
  } catch {}

  if (isBot) {
    return res.redirect(url.originalUrl);
  }

  res.redirect(url.originalUrl);
  
  let isUnique = false;

  try {
    await Visitor.create({
      urlId: url._id,
      userId: url.userId,
      visitorId,
      ipHash,
      date: today,
      device,
      country,
      referrer,
    });

    isUnique = true;
  } catch (err) {
    // Mongo duplicate key error
    if (err.code === 11000) {
      isUnique = false;
    } else {
      throw err;
    }
  }

  //update counters
    await Promise.all([
      Url.updateOne(
        { _id: url._id },
        {
          $inc: {
            totalClicks: 1,
            totalUniqueVisitors: isUnique ? 1 : 0,
          },
        },
      ),

      Analytics.updateOne(
        { urlId: url._id, userId: url.userId, date: today },
        {
          $inc: {
            clicks: 1,
            uniqueVisitors: isUnique ? 1 : 0,
            [`deviceStats.${device}`]: 1,
            [`countryStats.${country}`]: 1,
            [`referrerStats.${referrer}`]: 1,
          },
        },
        { upsert: true },
      ),
    ]).catch ((err) => {
    console.error("Analytics update failed:", err);
  });
};

export { redirectUrl };
