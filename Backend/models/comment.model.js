import mongoose, {Schema} from "mongoose";

const commentSchema = mongoose.Schema({
    content : {type: String, required: true},
    productId: {
        type: Schema.Types.ObjectId,
        ref: "productModel",
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    date: {type: Number, required: true}

}, {timestamps: true}
)

const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);
export default commentModel