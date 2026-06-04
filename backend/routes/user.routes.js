import express from 'express';
import { getCurrentUser,updateAssistant } from '../controllers/user.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';
const userRouter = express.Router();

userRouter.route("/current").get( isAuth,getCurrentUser);
userRouter.route("/update").post(isAuth,upload.single("AssistantImage"),updateAssistant);

export default userRouter; 