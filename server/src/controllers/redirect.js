import { Url } from "../models/url.js";
import crypto from "crypto";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { Visitor } from "../models/visitor.js";
import { Analytics } from "../models/analytics.js";
import { ApiError } from "../utils/ApiError.js";

const BOT_REGEX =
  /bot|crawl|spider|slurp|facebookexternalhit|twitterbot|slackbot|discordbot|whatsapp|preview|linkpreview|headless/i;

const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;

  if (!shortUrl) throw new ApiError(400, "Invalid shorturl");

  const url = await Url.findOne({ shortUrl });

  const FRONTEND_URL =
    process.env.FRONTEND_URL || "http://localhost:5173";

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

  // ---------------------------
  // 🔍 USER AGENT + BOT CHECK
  // ---------------------------
  const userAgent = req.headers["user-agent"] || "";
  const isBot =
    BOT_REGEX.test(userAgent) ||
    !req.headers["accept-language"] ||
    req.headers["purpose"] === "prefetch";

  // ---------------------------
  // 🌐 IP DETECTION (FIXED)
  // ---------------------------
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    "0.0.0.0";

  if (ip === "::1") ip = "127.0.0.1";

  const ipHash = crypto
    .createHash("sha256")
    .update(ip)
    .digest("hex");

  // ---------------------------
  // 📱 DEVICE DETECTION
  // ---------------------------
  let device = "other";

  if (!isBot) {
    const parser = new UAParser(userAgent);
    const type = parser.getDevice().type;

    if (type === "mobile") device = "mobile";
    else if (type === "tablet") device = "tablet";
    else device = "desktop";
  } else {
    device = "bot";
  }

  // ---------------------------
  // 🌍 GEO DETECTION
  // ---------------------------
  const geo = geoip.lookup(ip);
  const country = geo?.country || "Unknown";

  // ---------------------------
  // 🍪 VISITOR ID
  // ---------------------------
  let visitorId = req.cookies?.visitorId;

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    res.cookie("visitorId", visitorId, {
      maxAge: 31536000000,
      httpOnly: true,
    });
  }

  // ---------------------------
  // 📅 NORMALIZED DATE
  // ---------------------------
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ---------------------------
  // 🔗 REFERRER CLEANING
  // ---------------------------
  let referrer = "direct";

  try {
    if (req.headers.referer) {
      const hostname = new URL(req.headers.referer).hostname.toLowerCase();

      if (
        hostname.includes("localhost") ||
        hostname.includes("127.0.0.1") ||
        hostname.includes("vercel.app") ||
        hostname.includes("cutbit")
      ) {
        referrer = "direct";
      } else {
        const parts = hostname.split(".");
        referrer = parts.slice(-2).join(".");
      }
    }
  } catch {
    referrer = "direct";
  }

  // ---------------------------
  // 🚫 BLOCK BOT FROM TRACKING
  // ---------------------------
  if (isBot) {
    return res.redirect(url.originalUrl);
  }


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
    if (err.code === 11000) {
      isUnique = false;
    } else {
      console.error("Visitor error:", err);
    }
  }

  // ---------------------------
  // 📊 ANALYTICS UPDATE
  // ---------------------------
  try {
    await Promise.all([
      Url.updateOne(
        { _id: url._id },
        {
          $inc: {
            totalClicks: 1,
            totalUniqueVisitors: isUnique ? 1 : 0,
          },
        }
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
        { upsert: true }
      ),
    ]);
  } catch (err) {
    console.error("Analytics update failed:", err);
  }

  // ---------------------------
  // 🔁 REDIRECT (LAST STEP)
  // ---------------------------
  return res.redirect(url.originalUrl);
};

export { redirectUrl };