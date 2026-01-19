import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";

const addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.owner.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot add your own product to cart",
      });
    }

    const user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found."
      })
    }

    let cartData = user.cartData || new Map();

    if (cartData.has(productId)) {
      cartData.set(productId, cartData.get(productId) + 1);
    } else {
      cartData.set(productId, 1);
    }

    user.cartData = cartData;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Added to cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Problem occurred while adding item to cart",
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { action } = req.body; // "increment" or "decrement"

    if (!["increment", "decrement"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'increment' or 'decrement'.",
      });
    }

    const user = await userModel.findById(userId);

    if (!user || !user.cartData || !user.cartData.has(productId)) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
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
        return res.status(200).json({
          success: true,
          message: "Product removed from cart",
        });
      }
    }

    user.cartData.set(productId, quantity);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      productId,
      quantity,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Problem occurred while updating cart",
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found."
      })
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
      image: product.images,
      quantity: cartObj[product._id.toString()],
    }));

    return res.status(200).json({
      success: true,
      cart: cartWithDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Problem occurred while getting cart.",
    });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await userModel.findById(userId);

    if (!user || !user.cartData) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (user.cartData.has(productId)) {
      user.cartData.delete(productId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Problem occurred while removing item from cart",
    });
  }
};

const mergeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { guestCart } = req.body;

    if (!guestCart || Object.keys(guestCart).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No guest cart to merge",
      });
    }

    const user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found."
      })
    }
    const userCart = user.cartData || new Map();

    for (let productId in guestCart) {
      const qty = Number(guestCart[productId]);
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(404).json({
          success: false,
          message: "Cart item quantity can not be negative or 0",
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

    return res.status(200).json({
      success: true,
      message: "Cart merged successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to merge cart",
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
