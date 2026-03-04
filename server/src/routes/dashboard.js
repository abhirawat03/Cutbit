import {Router} from "express"
import { verifyJwt } from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboard.js";

const router = Router()

router.route("/stats").get(verifyJwt, getDashboardData)

export default router;