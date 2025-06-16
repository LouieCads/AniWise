module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-this-in-production",
  JWT_EXPIRES_IN: "24h",
  SALT_ROUNDS: 10
}; 