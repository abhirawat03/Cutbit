import {Router} from "express"
import { createShortUrl, deleteLink, getalllinks, getstats, redirectUrl} from "../controllers/url.js"

const router = Router()

router.route("/shorten").post(createShortUrl)
router.route("/links").get(getalllinks)
router.route("/stats").get(getstats)
router.route("/link/:id").delete(deleteLink)
router.route("/:shortUrl").get(redirectUrl)

export default router;