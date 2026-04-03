import User from "../db/models/users.js";
import auth from "../middleware/auth.js";

/**
 * @desc Register user
 * @route POST /users
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @desc Login user
 * @route POST /users/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );

    const token = await user.generateAuthToken();

    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: "Invalid email or password" });
  }
};

/**
 * @desc Get current user
 * @route GET /users/me
 * @access Private
 */
export const getMe = (req, res) => {
  res.json(req.user);
};

/**
 * @desc Logout current session
 * @route POST /users/logout
 * @access Private
 */
export const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);

    await req.user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Logout all sessions
 * @route POST /users/logoutAll
 * @access Private
 */
export const logoutAllUsers = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.json({ message: "Logged out from all devices" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Get all users
 * @route GET /users
 * @access Private (protect with auth, add admin later)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Update current user
 * @route PATCH /users/me
 * @access Private
 */
export const updateMe = async (req, res) => {
  const allowed = ["name", "email", "password"];
  const updates = Object.keys(req.body);

  const isValid = updates.every((f) => allowed.includes(f));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid fields" });
  }

  try {
    updates.forEach((f) => {
      req.user[f] = req.body[f];
    });

    await req.user.save();

    res.json(req.user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @desc Delete current user
 * @route DELETE /users/me
 * @access Private
 */
export const deleteMe = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.json({ message: "User deleted", user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
