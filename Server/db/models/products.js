import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  {
    strictPopulate: false,
  },
);

const Product = mongoose.model("Product", userSchema);

export default Product;
