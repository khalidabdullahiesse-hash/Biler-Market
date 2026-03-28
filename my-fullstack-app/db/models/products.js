import mongoose from "mongoose";

const Product = mongoose.model('products', {
    product:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    }
})


export default Product