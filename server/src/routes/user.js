import {Router} from "express"
import { verifyJwt } from "../middleware/auth.js";
import {upload} from "../middleware/multer.js"
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt ,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/current-user").get(verifyJwt,getCurrentUser)

router.route("/change-password").post(verifyJwt,changeCurrentPassword)

router.route("/update-account").patch(verifyJwt,updateAccountDetails)

router.route("/avatar").patch(verifyJwt,upload.single("avatar"), updateUserAvatar)


export default router;