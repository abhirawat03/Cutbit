import {Router} from "express"
import { createShortUrl, deleteLink, getalllinks, getstats, updateLink, redirectUrl} from "../controllers/url.js"
import { verifyJwt } from "../middleware/auth.js"

const router = Router()

router.route("/short").post(verifyJwt, createShortUrl)
router.route("/links").get(getalllinks)
router.route("/stats").get(getstats)
router.route("/link/:id").delete(deleteLink)
router.route("/:shortUrl").get(redirectUrl)

export default router;