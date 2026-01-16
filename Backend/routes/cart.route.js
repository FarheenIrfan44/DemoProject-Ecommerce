import express from 'express'
import { addToCart, getUserCart, updateCartQuantity , removeFromCart, mergeCart} from '../controllers/cart.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const cartRouter = express.Router();

cartRouter.use(verifyJWT)

cartRouter.get('/getCart', getUserCart);
cartRouter.post('/addToCart/:id', addToCart);
cartRouter.patch('/updateCart/:id', updateCartQuantity);
cartRouter.delete("/remove/:id",  removeFromCart);
cartRouter.post('/mergeCart', mergeCart)

export default cartRouter

