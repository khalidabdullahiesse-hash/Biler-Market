import express from "express";
import {
  createLoan,
  getAllLoans,
  getSingleLoan,
  updatePaidAmount,
  deleteLoan,
} from "../controllers/loanControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.post("/loans", auth, createLoan);
router.get("/loans", auth, getAllLoans);
router.get("/loans", auth, getSingleLoan);
router.patch("/loans/:id/pay", auth, updatePaidAmount);
router.delete("/loans/:id", auth, deleteLoan);

export default router;
