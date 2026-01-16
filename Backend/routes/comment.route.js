import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addComment, removeComment,updateComment,getComment } from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.use(verifyJWT);

commentRouter.post('/addComment/:id', addComment);
commentRouter.get('/getComment/:productId', getComment);
commentRouter.patch('/updateComment/:commentId', updateComment);
commentRouter.delete('/deleteComment/:commentId', removeComment);

export default commentRouter;