require("dotenv").config();
const mongoose = require("mongoose");

const databaseLink = process.env.MONGO_DB_LINK.replace(
  "<DATABASE_PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectToDatabase = () => {
  return mongoose.connect(databaseLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectToDatabase;
