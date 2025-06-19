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

const submitLoanApplication = (userId, formData) => {
  // Only allow one loan application per user for now
  if (loans.some((loan) => loan.userId === userId)) {
    return null; // Already exists
  }
  const newLoan = {
    id: loans.length + 1,
    userId,
    ...formData,
    // Default loan progress fields (can be updated later)
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    progressPercentage: 0,
    nextPaymentDate: "",
    monthlyPayment: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasLoan: true,
  };
  loans.push(newLoan);
  return newLoan;
};

const getLoanByUserId = (userId) => {
  return loans.find((loan) => loan.userId === userId) || null;
};

const updateLoanByUserId = (userId, updateData) => {
  const loanIndex = loans.findIndex((loan) => loan.userId === userId);
  if (loanIndex === -1) return null;
  loans[loanIndex] = {
    ...loans[loanIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  return loans[loanIndex];
};

const getAllLoans = () => loans;

module.exports = {
  submitLoanApplication,
  getLoanByUserId,
  updateLoanByUserId,
  getAllLoans,
};
