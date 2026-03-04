import {Router} from "express"
import { verifyJwt } from "../middleware/auth.js";
import { loginUser, registerUser } from "../controllers/user.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

export default router;