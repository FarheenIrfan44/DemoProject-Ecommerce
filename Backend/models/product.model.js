import mongoose, {Schema} from "mongoose"

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    owner: {
            type: Schema.Types.ObjectId,
            ref: "userModel",
            required: true
        },
    serialNumber : {type: String,required: true}

}, {timestamps: true})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel