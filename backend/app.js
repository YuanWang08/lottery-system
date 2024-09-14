const express = require("express");
const bodyParser = require("body-parser");

const connectToDatabase = require("./database/mongodb");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.send("<h2>Hi there! It's backend!</h2>");
});

app.use("/admin", require("./routes/admin.route"));

connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
