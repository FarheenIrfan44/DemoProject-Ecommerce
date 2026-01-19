import commentModel from "../models/comment.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const productId = req.params.id;
    if (!content) {
      return res.status(400).json({
        succcess: false,
        message: "The comment should have a body.",
      });
    }
    if (!productId) {
      return res.status(400).json({
        succcess: false,
        message: "The product id should be provided.",
      });
    }
    const ownerId = req.user._id;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (req.user._id.toString() === product.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: "Product owner cannot comment on their own product.",
      });
    }

    const newComment = {
      content,
      productId,
      ownerId,
      date: Date.now(),
    };
    const comment = new commentModel(newComment);
    await comment.save();
    return res.status(200).json({
      succcess: true,
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "The comment can not be added.",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    //console.log(req.user._id);

    if (comment.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to comment on your own product.",
      });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

const removeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    await commentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};

const getComment = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product does not exist",
      });
    }

    const comments = await commentModel
      .find({ productId })
      .sort({ createdAt: -1 });
    // console.log(comments)

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

export { addComment, updateComment, removeComment, getComment };
