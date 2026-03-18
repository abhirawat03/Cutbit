import {Router} from "express"
import { verifyJwt } from "../middleware/auth.js";
import {upload} from "../middleware/multer.js"
import { changeCurrentPassword, deleteUserAvatar, deleteUserProfile, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.js";
import { authLimiter, sensitiveLimiter, urlLimiter } from "../middleware/rateLimiter.js";

const router = Router()

router.route("/register").post(authLimiter, registerUser)

router.route("/login").post(authLimiter, loginUser)

router.route("/logout").post(verifyJwt ,logoutUser)

router.route('/delete-account').delete(verifyJwt, sensitiveLimiter, deleteUserProfile)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/current-user").get(verifyJwt,getCurrentUser)

router.route("/change-password").patch(verifyJwt, sensitiveLimiter, changeCurrentPassword)

router.route("/update-account").patch(verifyJwt, urlLimiter, updateAccountDetails)

router.route("/avatar").patch(verifyJwt, sensitiveLimiter,upload.single("avatar"), updateUserAvatar)

router.route("/avatar").delete(verifyJwt, deleteUserAvatar)


export default router;