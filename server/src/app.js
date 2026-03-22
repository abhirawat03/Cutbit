import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport";
import helmet from "helmet"
import compression from "compression";
import {errorHandler} from "./middleware/errorHandler.js"
import "./config/passport.js"
import { globalLimiter } from "./middleware/rateLimiter.js";
const app = express()

// security headers
app.use(helmet())

app.use(
    cors({
        origin:process.env.FRONTEND_URL,
        credentials:true
    })
)
app.use(
    compression({
        level: 6,
        threshold: 1024, // only compress >1KB
    })
);

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use(passport.initialize())
// app.use(globalLimiter)

app.get("/healthz", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

//route import
import urlRoutes from "./routes/url.js"
import userRouter from "./routes/user.js"
import dashboardRouter from "./routes/dashboard.js"
import { redirectUrl } from "../src/controllers/redirect.js"
import authRoutes from "./routes/auth.js"

//routes declaration
app.use("/api/v1/",urlRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.get("/:shortUrl",redirectUrl) 


app.use(errorHandler);

export {app}