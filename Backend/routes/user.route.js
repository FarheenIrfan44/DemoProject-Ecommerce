import express from 'express'
import { loginUser, signupUser } from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js';

const userRouter = express.Router();

userRouter.route('/sign-up').post(upload.single("profilePicture"), signupUser);
userRouter.post('/login', loginUser);


export default userRouter;

