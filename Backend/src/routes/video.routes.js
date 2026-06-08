import { Router } from "express";
import { getAllVideos, searchVideos ,getAllVideosOfChannel,publishAVideo,getVideoById ,updateVideoTitle,updateVideoDesc,updateVideoThumbnail,deleteVideo,togglePublishStatus} from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router=Router();
    router.route("/").get(getAllVideos)

    router.route("/channel/:userId").get(getAllVideosOfChannel)

router.route("/").post(verifyJWT,upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),publishAVideo)

router.route("/video/:videoId").get(getVideoById).patch(verifyJWT,deleteVideo)
router.route("/search").get(searchVideos)
router.route("/title/:videoId").patch(verifyJWT,updateVideoTitle)
router.route("/description/:videoId").patch(verifyJWT,updateVideoDesc)
router.route("/thumbnail/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideoThumbnail)
router.route("/publish/:videoId").patch(verifyJWT,togglePublishStatus)
        export default router