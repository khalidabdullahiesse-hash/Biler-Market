import express from "express";
import bcrypt from "bcrypt";
import User from "../db/models/users.js";

const router = express.Router();

// Create user
router.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = new User({
      ...req.body,
      password: hashedPassword
    });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).send({ error: error.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get one user
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update user
router.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send({ message: "User deleted", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;