import express from "express";
import User from "../db/models/users.js";

const router = express.Router();

// Create user
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).send({ error: error.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredential(
      req.body.email,
      req.body.password
    )
    res.status(201).send(user);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).send({ error: error.message });
  }
});


router.get("/users/me", async (req, res) => {
  try {

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

router.get('/home', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

export default router;