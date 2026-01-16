import express from 'express'

import {placeOrder, placeOrderStripe, userOrders} from '../controllers/order.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';

const orderRouter = express.Router();

orderRouter.use(verifyJWT)

orderRouter.post('/userOrder', userOrders);
orderRouter.post('/stripe', placeOrderStripe);
orderRouter.post('/placeOrder', placeOrder);

export default orderRouter;
