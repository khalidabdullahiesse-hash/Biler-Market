import mongoose from "mongoose";

const billsSchema = mongoose.Schema(
  {
    BillType: {
      type: String,
      require: true,
    },
    BillsAmount: {
      type: Number,
      require: true,
    },
    PiadBills: {
      type: Number,
      default: 0,
    },
    BillDitails: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
  },
  {
    timestamp: true,
    toJSON: true,
    toObject: true,
  },
);

const Bill = mongoose.model("Bill", billsSchema)

export default Bill