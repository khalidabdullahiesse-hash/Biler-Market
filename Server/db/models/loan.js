import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    totalAmount: {
      type: Number,
      require: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainAmount: {
      type: Number,
      require: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual to calculate remainAmount before saving
loanSchema.pre("save", function (next) {
  if (this.totalAmount && this.paidAmount !== undefined) {
    this.remainAmount = this.totalAmount - this.paidAmount;
  }
  next();
});

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
