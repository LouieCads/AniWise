module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET:
    process.env.JWT_SECRET || "your-secret-key-change-this-in-production",
  JWT_EXPIRES_IN: "24h",
  SALT_ROUNDS: 10,
  TWILIO_ACCOUNT_SID: "ACeeacf28d2050eda15a8035ffd9744651",
  TWILIO_AUTH_TOKEN: "40d4bf388b3c1dbd493dfc433bfe7eae",
  TWILIO_PHONE_NUMBER: "+13152848378",
};
