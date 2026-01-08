import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";

const placeOrder = async(res, req) => {
    try {
        const {items, amount, address} = req.body;
        const userId = req.user._id;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartdata: {}})

        return res.json({
            success: true,
            message: "Order placed."

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const placeOrderStripe = async(res, req) => {
    try {
        
    } catch (error) {
        
    }
}
const userOrders = async(res, req) => {
    try {
        
    } catch (error) {
        
    }
}

export {placeOrder, placeOrderStripe, userOrders}

