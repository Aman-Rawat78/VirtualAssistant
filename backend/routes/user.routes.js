import express from 'express';
import { getCurrentUser,updateAssistant } from '../controllers/user.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';
const userRouter = express.Router();

userRouter.route("/current").get( isAuth,getCurrentUser);
userRouter.route("/assistant").put(isAuth,updateAssistant);

export default userRouter; 