import { Url } from "../models/url.js";
import crypto from "crypto";
import geoip from "geoip-lite";
import {UAParser} from "ua-parser-js";
import { Visitor } from "../models/visitor.js";
import { Analytics } from "../models/analytics.js";
import { ApiError } from "../utils/ApiError.js";


const redirectUrl = async (req, res) => {
    const { shortUrl } = req.params;

    if (!shortUrl) throw new ApiError(400, "Invalid shorturl");

    // find link
    const url = await Url.findOne({ shortUrl }).lean();

    if (!url) throw new ApiError(404, "short url not found");

    // status check
    if (url.status === "paused") {
        throw new ApiError(403, "Link is paused");
    }

    // expiry check
    if (url.expiryDate && url.expiryDate < new Date()) {
        throw new ApiError(410, "Link expired");
    }

    //check visitor
    let visitorId = req.cookies?.visitorId;

    if (!visitorId) {
        visitorId = crypto.randomUUID();
        res.cookie("visitorId", visitorId, {
            maxAge: 31536000000, // 1 year
            httpOnly: true
        });
    }

    //date normalization
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //device detection
    const userAgent = req.headers["user-agent"] || "";

    const botRegex =
        /bot|crawl|spider|slurp|facebookexternalhit|twitterbot|slackbot|discordbot/i;

    let device = "other";

    if (botRegex.test(userAgent)) {
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
        req.ip;

    const geo = geoip.lookup(ip);

    const country = geo?.country || "Unknown";

    //ip hash
    const ipHash = crypto
        .createHash("sha256")
        .update(ip)
        .digest("hex");

    // UNIQUE VISITOR CHECK
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
            referrer: req.headers.referer
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
    Promise.all([
        Url.updateOne(
            { _id: url._id },
            {
                $inc: {
                    totalClicks: 1,
                    totalUniqueVisitors: isUnique ? 1 : 0
                }
            }
        ),

        Analytics.updateOne(
            { urlId: url._id,userId: url.userId, date: today },
            {
                $inc: {
                    clicks: 1,
                    uniqueVisitors: isUnique ? 1 : 0,
                    [`deviceStats.${device}`]: 1,
                    [`countryStats.${country}`]: 1
                }
            },
            { upsert: true }
        )
    ]).catch(console.error);

    return res.redirect(url.originalUrl);
};

export { redirectUrl }