import express from "express";
import auth from "../middleware/auth.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

// All routes are protected 🔐
router.post("/products", auth, createProduct);
router.get("/products", auth, getProducts);
router.get("/products/:id", auth, getProductById);
router.patch("/products/:id", auth, updateProduct);
router.delete("/products/:id", auth, deleteProduct);

export default router;