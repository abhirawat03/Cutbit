import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
    })
)

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//route import
import urlRoutes from "./routes/url.js"
import userRouter from "./routes/user.js"
import dashboardRouter from "./routes/dashboard.js"
import { redirectUrl } from "../src/controllers/redirect.js"

//routes declaration
app.use("/api/v1/",urlRoutes)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.get("/:shortUrl",redirectUrl) 

export {app}