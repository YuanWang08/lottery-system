const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

exports.login = async (req, res) => {
  const { password } = req.body;
  if (bcrypt.compareSync(password, adminPasswordHash)) {
    const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
};
