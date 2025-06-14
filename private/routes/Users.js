const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
// const { validateToken } = require('../middlewares/AuthMiddleware');

const { Users } = require("../models");

router.post("/registration", async (req, res) => {
  const { username, password } = req.body;

  await bcrypt.hash(password, 12).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });

    res.json("Success");
  });
});

router.get("/registration", async (req, res) => {
  const users = await Users.findAll();
  res.json(users);
});

router.post("/login", async (req, res) => {
  const { id, username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } }); // Check if inputted id is the same in the db

  if (!user) return res.status(404).json({ error: "User doesn't exist" });

  // Check if password is registered. Comparing hash with an inputted password
  await bcrypt.compare(password, user.password).then((match) => {
    if (!match) return res.status(401).json({ error: "Wrong Username/Password" });

    // Generate the JWT
    const accessToken = sign(
      { id: id, username: user.username, password: user.password },
      "importantSecret",
      { expiresIn: "1h" }
    )

    res.json({ token: accessToken, username: username, id: id, success: true }); // Sends a success: true flag with the access token for successful logins.
  });
});

// check if valid 
router.get('/auth', (req, res) => {
  res.json(req.user);
})

module.exports = router;