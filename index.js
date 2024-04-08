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

app.get("/", function (req, res) {
  console.log("測試");
  res.send("哈哈");
});

// 註冊方法
const { register } = require("./db/user");
app.post("/register", async function (req, res) {
  const body = req.body;
  console.log("建帳號", body);

  const { name, email, password } = body;
  //   console.log("建帳號", name, email, password);

  if (!name || !email || !password) {
    res.status(400).send({ error: "缺少資料" });
    return;
  }

  // 寫入 mongoDB
  const userData = {
    email,
    password,
    name,
  };

  let result = null;
  try {
    result = await register(userData);
    console.log(result);
    return res.send({ msg: "成功" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "內部錯誤" });
    return;
  }
});

// 登入方法
const { getUserByEmail } = require("./db/user");
const { storeRefreshToken } = require("./db/refreshTokens");
const { generateTokens } = require("./utils/jwt");

const bcrypt = require("bcrypt");

app.post("/login", async function (req, res) {
  //   console.log("身體在哪裡", req);
  const body = req.body;
  console.log(body);

  const { email, password } = body;
  console.log("登入", email, password);

  if (!email || !password) {
    res.status(400).send({ error: "缺少帳號密碼" });
    return;
  }

  // 資料庫查找對應的用戶
  const user = await getUserByEmail(email);
  console.log("資料庫查詢結果:", user);
  if (!user) {
    res.status(400).send({ error: "查無此用戶" });
    return;
  }

  // 檢查密碼正確性
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  console.log("密碼正確？:", isPasswordMatched);
  if (!isPasswordMatched) {
    res.status(400).send({ error: "密碼錯誤" });
    return;
  }

  //   const { accessToken, refreshToken } = generateTokens(user);
  //   console.log("產生 JWT:", accessToken, refreshToken);

  // 資料庫跟 Cookie 都存一份，重連時核對
  //   await storeRefreshToken(refreshToken, user.id);
  //   setCookie(event, "refresh_token", refreshToken, {
  //     httpOnly: true,
  //     sameSite: true,
  //   });
  res.send({ state: 200, msg: "成功" });
  return {
    code: 200,
    // access_token: accessToken,
  };
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));
