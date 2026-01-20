import commentModel from "../models/comment.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import {
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_ERROR,
  MSG_PRODUCT_NOT_FOUND,
  MSG_SERVER_PROBLEM,
  MSG_COMMENT_BODY_MISSING,
  MSG_COMMENT_DELETED,
  MSG_COMMENT_FAIL,
  MSG_COMMENT_NOT_FOUND,
  MSG_FETCH_FAILED_COMMENTS,
  MSG_FORBIDDEN_OPERATION,
  MSG_PRODUCT_ID_MISSING,
  MSG_PRODUCT_NOT_EXISTS,
  MSG_UPDATE_FAILED,
  STATUS_FORBIDDEN,
  MSG_NOT_ALLOWED,
} from "../constants/index.js";

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const productId = req.params.id;
    if (!content) {
      return res.status(STATUS_BAD_REQUEST).json({
        succcess: false,
        message: MSG_COMMENT_BODY_MISSING,
      });
    }
    if (!productId) {
      return res.status(STATUS_BAD_REQUEST).json({
        succcess: false,
        message: MSG_PRODUCT_ID_MISSING,
      });
    }
    const ownerId = req.user._id;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_PRODUCT_NOT_FOUND,
      });
    }

    if (req.user._id.toString() === product.owner.toString()) {
      return res.status(STATUS_FORBIDDEN).json({
        success: false,
        message: `${MSG_FORBIDDEN_OPERATION}.Product owner cannot comment on their own product.`,
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
    return res.status(STATUS_OK).json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    //console.log(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${MSG_SERVER_PROBLEM}The comment can not be added.`,
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_COMMENT_NOT_FOUND,
      });
    }

    //console.log(req.user._id);

    if (comment.ownerId.toString() !== req.user._id.toString()) {
      return res.status(STATUS_FORBIDDEN).json({
        success: false,
        message: `${MSG_NOT_ALLOWED}to update this comment.`,
      });
    }

    comment.content = content;
    await comment.save();

    return res.status(STATUS_OK).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    //console.log(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: MSG_UPDATE_FAILED,
    });
  }
};

const removeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_COMMENT_NOT_FOUND,
      });
    }

    if (comment.ownerId.toString() !== req.user._id.toString()) {
      return res.status(STATUS_FORBIDDEN).json({
        success: false,
        message: `${MSG_FORBIDDEN_OPERATION}.You are not allowed to delete this comment.`,
      });
    }

    await commentModel.findByIdAndDelete(commentId);

    return res.status(STATUS_OK).json({
      success: true,
      message: MSG_COMMENT_DELETED,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: MSG_COMMENT_FAIL,
    });
  }
};

const getComment = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(STATUS_BAD_REQUEST).json({
        success: false,
        message: MSG_PRODUCT_ID_MISSING,
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(STATUS_NOT_FOUND).json({
        success: false,
        message: MSG_PRODUCT_NOT_EXISTS,
      });
    }

    const comments = await commentModel
      .find({ productId })
      .sort({ createdAt: -1 });
    // console.error(comments)

    return res.status(STATUS_OK).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    //console.error(error);
    return res.status(STATUS_INTERNAL_ERROR).json({
      success: false,
      message: MSG_FETCH_FAILED_COMMENTS,
    });
  }
};

export { addComment, updateComment, removeComment, getComment };
