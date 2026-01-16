import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
//import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import commentRouter from "./routes/comment.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;
connectDB();
//connectCloudinary();

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/comment', commentRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get("/", (req, res) => {
  res.send(`Welcome to E-commerce app`);
});

app.listen(PORT, () =>
  console.log(`Server is listning on port http://localhost:${PORT}`)
);
