// In-memory database (replace with real database in production)
let users = [];

const findUserByName = (name) => {
  return users.find((user) => user.name.toLowerCase() === name.toLowerCase());
};

const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

const createUser = (userData) => {
  const newUser = {
    id: users.length + 1,
    creditLimit:
      userData.creditLimit !== undefined ? userData.creditLimit : 5000, // Default credit limit
    creditScore:
      userData.creditScore !== undefined ? userData.creditScore : null, // Default credit score
    ...userData,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

const getAllUsers = () => {
  return users.map(({ password, ...user }) => user);
};

const getUserCount = () => users.length;

module.exports = {
  findUserByName,
  findUserById,
  createUser,
  getAllUsers,
  getUserCount,
};
