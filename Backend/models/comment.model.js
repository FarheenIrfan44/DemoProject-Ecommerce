import mongoose, {Schema} from "mongoose";

const commentSchema = mongoose.Schema({
    content : {type: String, required: true},
    productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    date: {type: Date, required: true}

}, {timestamps: true}
)

const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);
export default commentModel