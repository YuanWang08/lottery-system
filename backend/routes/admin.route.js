const express = require("express");

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth.mid");

const router = express.Router();

router.route("/").post(adminController.login);

router.route("/test").get(authMiddleware.authenticateToken, (req, res) => {
  res.json({ message: "You are authenticated!" });
});

module.exports = router;
