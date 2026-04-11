import Loan from "../db/models/loan.js";

// POST /api/loans
export const createLoan = async (req, res) => {
    try {
        const { totalAmount } = req.body;

        if (!totalAmount) {
            return res.status(400).json({ message: "totalAmount is required" });
        }

        const loan = await Loan.create({
            totalAmount,
            paidAmount: 0,
            owner: req.user._id,  // comes from your auth middleware
        });

        res.status(201).json({ message: "Loan created", loan });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/loans
export const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ owner: req.user._id });

        res.status(200).json({ count: loans.length, loans });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/loans/:id
export const getSingleLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        // Make sure the requester is the owner
        if (loan.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ loan });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// PATCH /api/loans/:id/pay
export const updatePaidAmount = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "A valid payment amount is required" });
        }

        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        if (loan.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Prevent overpaying
        if (loan.paidAmount + amount > loan.totalAmount) {
            return res.status(400).json({ message: "Payment exceeds remaining loan balance" });
        }

        loan.paidAmount += amount;
        await loan.save();

        res.status(200).json({
            message: "Payment recorded",
            loan,
            remainAmount: loan.remainAmount  // virtual field
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE /api/loans/:id
export const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        if (loan.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await loan.deleteOne();

        res.status(200).json({ message: "Loan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};