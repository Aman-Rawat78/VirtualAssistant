import express from 'express';
import { AskToAssistant, getCurrentUser,updateAssistant } from '../controllers/user.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';
const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.single("AssistantImage"), updateAssistant);
userRouter.post("/AskAssistant", isAuth, AskToAssistant);

export default userRouter; 