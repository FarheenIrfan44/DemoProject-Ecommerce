import express from "express";
import {addProduct, getProductById,getProducts, removeProduct, updateProduct, getProductsOfUser} from "../controllers/product.controller.js"
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.get('/get', getProducts);
productRouter.get('/productById/:id', getProductById);

productRouter.post(
  '/add',
  verifyJWT,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

productRouter.patch('/update/:id', verifyJWT, updateProduct);
productRouter.delete('/remove/:id', verifyJWT, removeProduct);
productRouter.get('/getUserProduct', verifyJWT ,getProductsOfUser);

export default productRouter;
