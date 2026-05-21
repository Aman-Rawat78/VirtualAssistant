import express from 'express';
import { logout, signIn, signUp } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.route("/signup").post( signUp );
authRouter.route("/signin").post( signIn );
authRouter.route("/logout").post( logout );

export default authRouter;