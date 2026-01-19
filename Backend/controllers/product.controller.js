import { uploadOnCloudinary } from "../config/cloudinary.js";
import productModel from "../models/product.model.js";
import generateSerialNumber from "../utils/serialNumberGenerator.js";
import commentModel from "../models/comment.model.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const files = req.files ?? {}
    const image1 = files.image1?.[0];
    const image2 = files.image1?.[0];
    const image3 = files.image1?.[0];
    const image4 = files.image1?.[0];
    const serialNumber = generateSerialNumber();

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await uploadOnCloudinary(item.path);
        return result?.secure_url || null;
      })
    ).then((urls) => urls.filter(Boolean));

    const owner = req.user._id;

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      image: imagesUrl,
      owner,
      serialNumber,
    };
    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Products not found"
      })
    }
    return res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await commentModel.deleteMany({ productId });
    await productModel.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });
    const { name, description, price, replaceIndex } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length > 0) {
      const uploadedUrls = await Promise.all(
        images.map(async (item) => {
          const result = await uploadOnCloudinary(item.path);
          return result?.secure_url || null;
        })
      ).then((urls) => urls.filter(Boolean));

      uploadedUrls.forEach((url, index) => {
        if (product.image.length < 4) {
          product.image.push(url);
        } else if (replaceIndex !== undefined) {
          product.image[replaceIndex] = url;
        }
      });
    }
    await product.save();
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

const getProductsOfUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await productModel.find({ owner: userId });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product found.",
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Problem occured while fetching products",
    });
  }
};

export {
  addProduct,
  getProductById,
  getProducts,
  removeProduct,
  updateProduct,
  getProductsOfUser,
};
