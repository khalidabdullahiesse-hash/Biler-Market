import jwt from "jsonwebtoken";
import User from "../db/models/users.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send("No token provided");
    }

    const decoded = jwt.verify(token, "thisMyToken");
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
    await user.save()
    if (!user) {
      return res.status(401).send("User not found or token invalid");
    }

    req.user = user;
    req.token = token; // useful for logout later
    next();
  } catch (e) {
    console.error("Auth middleware error:", e.message);
    if (e.name === "TokenExpiredError") {
      return res.status(401).send("Token expired");
    }
    res.status(401).send("You are not authenticated");
  }
};

export default auth;