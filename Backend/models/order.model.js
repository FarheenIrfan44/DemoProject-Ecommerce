import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    items: {type: Array, required: true}

})

