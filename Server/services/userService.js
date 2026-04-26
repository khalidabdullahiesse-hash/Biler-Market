import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/users.js";

export const virtual = () => {
  userSchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "owner",
  });
};

export const generateAuthToken = () => {
  userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "thisMyToken");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  };
};

export const toJSON = () => {
  userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.__v;
    return userObject;
  };
};

export const findByCredentials = () => {
  userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Unable to login");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Unable to login");

    return user;
  };
};

export const pre = () => {
    userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});
}