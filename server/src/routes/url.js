import {Router} from "express"
import { createShortUrl, deleteLink, getalllinks, getstats, updateLink} from "../controllers/url.js"
import { verifyJwt } from "../middleware/auth.js"

const router = Router()

router.route("/link").post(verifyJwt, createShortUrl)
router.route("/links").get(verifyJwt,getalllinks)
router.route("/stats").get(verifyJwt,getstats)
router.route("/links/:linkId").delete(verifyJwt,deleteLink)
router.route("/links/:linkId").patch(verifyJwt,updateLink)

export default router;