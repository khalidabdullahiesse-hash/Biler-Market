import express from "express";
import auth from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  logoutAllUsers,
  getAllUsers,
  updateMe,
  deleteMe,
} from "../controllers/userControllers.js";

const router = express.Router();
// Public
router.post("/users", registerUser);
router.post("/users/login", loginUser);
// Private
router.get("/users/me", auth, getMe);
router.post("/users/logout", auth, logoutUser);
router.post("/users/logoutAll", auth, logoutAllUsers);
router.get("/users", auth, getAllUsers);
router.patch("/users/me", auth, updateMe);
router.delete("/users/me", auth, deleteMe);

export default router;