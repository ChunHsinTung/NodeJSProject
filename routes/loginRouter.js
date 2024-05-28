const { getUserByEmail, getUserById } = require("../db/user");
const { generateTokens, decodeRefreshToken } = require("../utils/jwt");

const bcrypt = require("bcrypt");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("login/GET Route success");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  // 讀取 cookie
  const cookieJWT = req.cookies['refresh_token'];
  // console.log(cookieJWT);

  // 有 cookie 的 JWT 自動重登
  let decodedJWT = cookieJWT ? decodeRefreshToken(cookieJWT) : false;
  if (decodedJWT) {
    console.log("JWT 解碼成功，自動重登");
    const user = await getUserById(decodedJWT.userId)
    // console.log(user);

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refresh_token', refreshToken, {
      maxAge: 900000,  // 有效期，單位為毫秒
      httpOnly: true,  // 增強安全性，使 JavaScript 無法讀取此 cookie
      secure: true    // 確保只有在 HTTPS 上才發送 cookie
    });
    return res.status(200).json(
      {
        access_token: accessToken
      }
    );
  }

  if (!email || !password) return res.status(400).json(
    {
      "status": false,
      "message": "錯誤：缺少帳號或密碼"
    }
  );

  // 資料庫查找對應的用戶
  const user = await getUserByEmail(email);
  // console.log(user);

  if (!user) return res.status(404).json(
    {
      "status": false,
      "message": "錯誤：找不到此用戶"
    }
  );

  // 檢查密碼正確性
  const isPasswordMatched = await bcrypt.compare(password, user.password)
  // console.log(isPasswordMatched);
  if (!isPasswordMatched) return res.status(401).json(
    {
      "status": false,
      "message": "錯誤：帳號密碼錯誤"
    }
  );

  // 生成 JWT
  const { accessToken, refreshToken } = generateTokens(user);
  // console.log(accessToken, refreshToken);

  // 設置 cookie
  res.cookie('refresh_token', refreshToken, {
    maxAge: 900000,  // 有效期，單位為毫秒
    httpOnly: true,  // 增強安全性，使 JavaScript 無法讀取此 cookie
    secure: true    // 確保只有在 HTTPS 上才發送 cookie
  });

  return res.status(200).json(
    {
      access_token: accessToken
    }
  );

});

module.exports = router;
