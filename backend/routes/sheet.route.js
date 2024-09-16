const express = require("express");
const authMiddleware = require("../middleware/auth.mid");
const router = express.Router();

// 提交抽獎表單
router.route("/").post(async (req, res) => {
  const UnitModel = require("../models/unit");

  // 檢查是否有重複的學號
  const student_number = req.body.student_number;
  const unitExist = await UnitModel.findOne({ student_number: student_number });
  if (unitExist) {
    return res.status(400).json({ message: "Student number already exists" });
  }

  const unit = new UnitModel({
    student_number: req.body.student_number,
    department: req.body.department,
    grade: req.body.grade,
    name: req.body.name,
    isFacebook: req.body.isFacebook,
    isInstagram: req.body.isInstagram,
    isDiscord: req.body.isDiscord,
    facebook_id: req.body.facebook_id,
    instagram_id: req.body.instagram_id,
    discord_id: req.body.discord_id,
  });

  try {
    await unit.save();

    // 如果成功新增unit，則幫該unit添加lotteries
    // 每個unit預設都有一張lottery，如果有選擇facebook、instagram或discord，則每項各新增一張lottery，最多四張
    // 每張lottery為一個12位大寫英文與數字結合的字串，隨機生成
    // 例如：'A1B2C3D4E5F6'

    var amount = 1;
    var lotteries = [];
    if (req.body.isFacebook) {
      amount++;
    }
    if (req.body.isInstagram) {
      amount++;
    }
    if (req.body.isDiscord) {
      amount++;
    }

    for (let i = 0; i < amount; i++) {
      let lottery = "";
      for (let j = 0; j < 12; j++) {
        const charOrNum = Math.random() < 0.5 ? "char" : "num";
        if (charOrNum === "char") {
          lottery += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        } else {
          lottery += Math.floor(Math.random() * 10);
        }
      }
      lotteries.push(lottery);
    }

    // 更新unit的lotteries
    await UnitModel.updateOne(
      { student_number: req.body.student_number },
      { lotteries: lotteries }
    );

    // 回傳前端狀態代碼訊息，包含學號與抽獎號碼
    res.status(201).json({
      student_number: req.body.student_number,
      lotteries: lotteries,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
  }
});

// 取得所有unit
router.route("/").get(authMiddleware.authenticateToken, async (req, res) => {
  const UnitModel = require("../models/unit");

  try {
    const units = await UnitModel.find({});
    res.json({ units: units });
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;
