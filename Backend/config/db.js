import mongoose from "mongoose";


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log(`\n MongoDb connected.`);
        })
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
       
    } catch (error) {
        console.log("MongoDb coneection error ", error);
        process.exit(1)
    }
}

export default connectDB