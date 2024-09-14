const express = require("express");

const router = express.Router();

// 根據student_number搜尋出對應unit的lotteries
router.route("/").get(async (req, res) => {
  const student_number = req.body.student_number;
  const UnitModel = require("../models/unit");

  try {
    console.log(student_number);
    const unit = await UnitModel.findOne({ student_number: student_number });
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.json({ lotteries: unit.lotteries });
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;
