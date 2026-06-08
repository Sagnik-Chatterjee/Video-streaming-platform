import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile,getChannel, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
const router=Router()

//Since is app.js we have used app.use("/api/v1/users",userRouter) so the overall url becomes /api/v1/users/register
router.route("/register").post(
    //Upload multiple fields through multer it accepts an array
    //Multer middleware
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    //Secured routes
    router.route("/logout").post(verifyJWT, logoutUser)
    router.route("/refresh-token").post(refreshAccessToken)

    router.route("/change-password").post(verifyJWT,changeCurrentPassword)
    router.route("/current-user").get(verifyJWT,getCurrentUser)
    router.route("/update-account").patch(verifyJWT,updateAccountDetails)
    router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
    router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
    router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
    router.route("/history").get(verifyJWT,getWatchHistory)
    router.route("/p/:id").get(getChannel)
export default router