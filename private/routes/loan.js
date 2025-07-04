const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  submitLoanApplication,
  getLoanByUserId,
  updateLoanByUserId,
  getAllLoans,
  getLoansByUserId,
} = require("../models/loan");
const config = require("../config/config");
const { findUserById } = require("../models/user");
let twilioClient = null;
if (config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
  twilioClient = require("twilio")(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN
  );
}

// Submit a new loan application (protected)
router.post("/loans", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const formData = req.body;
  const user = findUserById(userId);
  const userCreditLimit =
    user && user.creditLimit !== undefined ? user.creditLimit : 5000;
  if (getLoanByUserId(userId)) {
    return res.status(409).json({
      success: false,
      message: "Loan application already exists for this user.",
      hasLoan: true,
    });
  }
  const newLoan = submitLoanApplication(userId, formData, userCreditLimit);
  if (newLoan && newLoan.error && newLoan.code === 400) {
    return res.status(400).json({
      success: false,
      message: newLoan.error,
      hasLoan: false,
    });
  }
  if (!newLoan) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit loan application.",
      hasLoan: false,
    });
  }

  // Send SMS after successful loan creation
  let smsStatus = "not_sent";
  let smsError = null;
  if (twilioClient && formData.contactNumber) {
    try {
      // Always send to the Twilio phone number for now (for testing)
      const toNumber = config.TWILIO_TO_PHONE_NUMBER;
      await twilioClient.messages.create({
        body: "Your loan has been successfully completed. Thank you!",
        from: config.TWILIO_PHONE_NUMBER,
        to: toNumber,
      });
      smsStatus = "sent";
    } catch (err) {
      smsStatus = "failed";
      smsError = err.message || "Unknown error";
      console.error("SMS sending failed:", err);
    }
  }

  res.status(201).json({
    success: true,
    message: "Loan application submitted successfully.",
    loan: newLoan,
    hasLoan: true,
    smsStatus,
    ...(smsError ? { smsError } : {}),
  });
});

// Get current user's loan info (protected)
router.get("/loans/my", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const loan = getLoanByUserId(userId);
  if (!loan) {
    return res.json({
      success: true,
      hasLoan: false,
      loan: null,
    });
  }
  res.json({
    success: true,
    hasLoan: true,
    loan,
  });
});

// Update current user's loan info (protected)
// You can update status by sending { status: 'Approved' } or { status: 'Paid' } in the body
router.put("/loans/my", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const updateData = req.body;
  const updatedLoan = updateLoanByUserId(userId, updateData);
  if (!updatedLoan) {
    return res.status(404).json({
      success: false,
      message: "Loan application not found for this user.",
      hasLoan: false,
    });
  }
  res.json({
    success: true,
    message: "Loan application updated successfully.",
    loan: updatedLoan,
    hasLoan: true,
  });
});

// (Optional) Get all loans (for admin/testing)
router.get("/loans", (req, res) => {
  res.json({
    success: true,
    loans: getAllLoans(),
    count: getAllLoans().length,
  });
});

// Get all loans for the current user (protected)
router.get("/loans/my/all", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const loans = getLoansByUserId(userId);
  res.json({
    success: true,
    loans,
    count: loans.length,
  });
});

module.exports = router;
