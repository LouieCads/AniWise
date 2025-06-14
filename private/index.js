const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3308;

app.use(express.json());
app.use(cors());

const db = require("./models");

const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});