import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens:[{
    token:{
      type:String,
      require:true
    }
  }]
});



userSchema.virtual('product' ,{
  ref:'Product',
  localField:"_id",
  foreignField:"owner"
})



userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id : user._id.toString() }, "thisMyToken")
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}




userSchema.methods.toJSON = function (){
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v
  return userObject
  
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");

  return user;
};

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

const User = mongoose.model("users", userSchema);

export default User;
