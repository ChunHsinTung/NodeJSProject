const express = require("express");
const app = express();

// 這樣才能讀取 巴底
app.use(express.json());

require("dotenv").config();
console.log(process.env.DB_HOST);
const mongodbUri = process.env.DB_HOST;
// 連線資料庫
const mongoose = require("mongoose");
try {
  console.log(`連線資料庫${mongodbUri}...`);
  mongoose.connect(mongodbUri);
  console.log("資料庫連線成功");
} catch (error) {
  console.error("連線失敗，理由：", error);
}

// 引入用戶驗證路由
const auth = require("./routes/auth");
app.use("/auth", auth);
// 引入文章路由
const article = require("./routes/article");
app.use("/article", article);

app.get("/", function (req, res) {
  console.log("測試");
  res.send("哈哈");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));
