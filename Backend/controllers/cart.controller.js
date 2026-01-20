import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import {
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_ERROR,
  MSG_PRODUCT_NOT_FOUND,
  MSG_USER_NOT_FOUND,
  MSG_NOT_ALLOWED,
  MSG_SERVER_PROBLEM,
  MSG_MERGE_CART,
  MSG_MERGE_CART_FAIL,
  MSG_ADD_TO_CART,
  MSG_BAD_REQUEST,
  MSG_NO_CART_FOUND,
  MSG_REMOVED_FROM_CART,
  MSG_UPDATED_CART,
} from "../constants/index.js";

const addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_PRODUCT_NOT_FOUND,
      });
    }
    if (product.owner.toString() === userId.toString()) {
      return res.status(STATUS_BAD_REQUEST).json({
        success: false,
        message: MSG_NOT_ALLOWED,
      });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_USER_NOT_FOUND,
      });
    }

    let cartData = user.cartData || new Map();
    if (cartData.has(productId)) {
      cartData.set(productId, cartData.get(productId) + 1);
    } else {
      cartData.set(productId, 1);
    }
    user.cartData = cartData;
    await user.save();
    return res.status(STATUS_OK).json({
      success: true,
      message: MSG_ADD_TO_CART,
    });
  } catch (error) {
    //console.error(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: MSG_SERVER_PROBLEM,
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { action } = req.body; // "increment" or "decrement"

    if (!["increment", "decrement"].includes(action)) {
      return res.status(STATUS_BAD_REQUEST).json({
        success: false,
        message: `${MSG_BAD_REQUEST}. Must be 'increment' or 'decrement'.`,
      });
    }
    const user = await userModel.findById(userId);
    if (!user || !user.cartData || !user.cartData.has(productId)) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_PRODUCT_NOT_FOUND,
      });
    }
    let quantity = user.cartData.get(productId);

    if (action === "increment") {
      quantity += 1;
    } else if (action === "decrement") {
      quantity -= 1;
      if (quantity <= 0) {
        user.cartData.delete(productId);
        await user.save();
        return res.status(STATUS_OK).json({
          success: true,
          message: MSG_REMOVED_FROM_CART,
        });
      }
    }

    user.cartData.set(productId, quantity);
    await user.save();
    return res.status(STATUS_OK).json({
      success: true,
      message: MSG_UPDATED_CART,
      productId,
      quantity,
    });
  } catch (error) {
    //console.error(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${MSG_SERVER_PROBLEM} Can not update cart.`,
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_USER_NOT_FOUND,
      });
    }
    const cartMap = user.cartData || new Map();
    const cartObj = Object.fromEntries(cartMap);

    const productIds = Object.keys(cartObj);

    const products = await productModel
      .find({
        _id: { $in: productIds },
      })
      .select("name price image");

    const cartWithDetails = products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: cartObj[product._id.toString()],
    }));

    return res.status(STATUS_OK).json({
      success: true,
      cart: cartWithDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${MSG_SERVER_PROBLEM} Can not get cart.`,
    });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await userModel.findById(userId);

    if (!user || !user.cartData) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_CART_EMPTY,
      });
    }

    if (user.cartData.has(productId)) {
      user.cartData.delete(productId);
      await user.save();
      return res.status(STATUS_OK).json({
        success: true,
        message: MSG_REMOVED_FROM_CART,
      });
    } else {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: `${MSG_PRODUCT_NOT_FOUND} in cart.`,
      });
    }
  } catch (error) {
    //console.error(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${MSG_SERVER_PROBLEM}Problem occurred while removing item from cart`,
    });
  }
};

const mergeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { guestCart } = req.body;

    if (!guestCart || Object.keys(guestCart).length === 0) {
      return res.status(STATUS_NOT_FOUND).json({
        success: true,
        message: `${MSG_NO_CART_FOUND} to merge`,
      });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_USER_NOT_FOUND,
      });
    }
    const userCart = user.cartData || new Map();

    for (let productId in guestCart) {
      const qty = Number(guestCart[productId]);
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(STATUS_BAD_REQUEST).json({
          success: false,
          message: `${MSG_BAD_REQUEST} Cart item quantity can not be negative or 0`,
        });
      }

      if (userCart.has(productId)) {
        userCart.set(productId, userCart.get(productId) + qty);
      } else {
        userCart.set(productId, qty);
      }
    }

    user.cartData = userCart;
    await user.save();

    return res.status(STATUS_OK).json({
      success: true,
      message: MSG_MERGE_CART,
    });
  } catch (error) {
    //console.error(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: MSG_MERGE_CART_FAIL,
    });
  }
};

export {
  addToCart,
  updateCartQuantity,
  getUserCart,
  removeFromCart,
  mergeCart,
};
