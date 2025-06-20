// In-memory database for loan applications (replace with real database in production)
let loans = [];

// Structure for loanFormData from frontend:
// {
//   pangalan: '',
//   contactNumber: '',
//   address: '',
//   edad: '',
//   trabaho: '',
//   kita: '',
//   dahilan: '',
// }
// Plus loan progress fields:
//   totalAmount, paidAmount, remainingAmount, progressPercentage, nextPaymentDate, monthlyPayment

const submitLoanApplication = (userId, formData, userCreditLimit = 5000) => {
  // crops: [{ name, price }]
  const crops = formData.crops || [];
  const totalAmount = crops.reduce((sum, crop) => sum + (crop.price || 0), 0);
  if (totalAmount > userCreditLimit) {
    return { error: "Loan exceeds your credit limit", code: 400 };
  }
  const newLoan = {
    id: loans.length + 1,
    userId,
    crops,
    totalAmount,
    ...formData,
    // Default loan progress fields (can be updated later)
    paidAmount: 0,
    remainingAmount: totalAmount,
    progressPercentage: 0,
    nextPaymentDate: "",
    monthlyPayment: 0,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasLoan: true,
  };
  loans.push(newLoan);
  return newLoan;
};

const getLoansByUserId = (userId) => {
  return loans.filter((loan) => loan.userId === userId);
};

const getLoanByUserId = (userId) => {
  // Deprecated: use getLoansByUserId for multiple loans
  return loans.find((loan) => loan.userId === userId) || null;
};

const updateLoanByUserId = (userId, updateData) => {
  // Update the most recent loan for the user
  const userLoans = loans.filter((loan) => loan.userId === userId);
  if (userLoans.length === 0) return null;
  // Update the latest loan (by createdAt)
  const latestLoanIndex = loans.findIndex(
    (loan) => loan.id === userLoans[userLoans.length - 1].id
  );
  loans[latestLoanIndex] = {
    ...loans[latestLoanIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  return loans[latestLoanIndex];
};

const getAllLoans = () => loans;

module.exports = {
  submitLoanApplication,
  getLoanByUserId, // deprecated
  getLoansByUserId,
  updateLoanByUserId,
  getAllLoans,
};
