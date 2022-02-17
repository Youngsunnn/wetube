import express from "express";
import {getEdit, postEdit, remove, logout, see, getUploadmedia, postUploadmedia} from "../controllers/userController"
import {protectorMiddleware, publicOnlyMiddleware, avatarUpload} from "../middlewares"

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/remove", remove);
userRouter.get(":id", see);

export default userRouter;