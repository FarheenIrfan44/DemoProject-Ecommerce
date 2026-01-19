import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error("MONGODB URI is not set.");
    }
    mongoose.connection.once("connected", () => {
      console.log(`MongoDb connected.`);
    });
    await mongoose.connect(`${MONGODB_URI}`);
  } catch (error) {
    console.log("MongoDb connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
