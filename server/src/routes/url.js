import {Router} from "express"
import { createShortUrl, deleteLink, getalllinks, getstats, updateLink} from "../controllers/url.js"
import { verifyJwt } from "../middleware/auth.js"

const router = Router()

router.route("/short").post(verifyJwt, createShortUrl)
router.route("/links").get(verifyJwt,getalllinks)
router.route("/stats").get(verifyJwt,getstats)
router.route("/link/:id").delete(deleteLink)

export default router;