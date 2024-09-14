const express = require("express");
const authMiddleware = require("../middleware/auth.mid");
const router = express.Router();

// 取得所有lotteries
router.route("/").get(authMiddleware.authenticateToken, async (req, res) => {
  const UnitModel = require("../models/unit");

  try {
    const units = await UnitModel.find({});
    const lotteries = units.reduce((acc, unit) => {
      return acc.concat(unit.lotteries);
    }, []);
    res.json({ lotteries: lotteries });
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;
