const express = require("express");
const router = express.Router();

// 文章列表
router.get("/", (req, res) => {
  res.send("Article list");
});

// 獲取單個文章
router.get("/:id", (req, res) => {
  res.send(`Article with ID: ${req.params.id}`);
});

module.exports = router;
