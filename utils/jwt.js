const jwt = require("jsonwebtoken");

const jwtAccessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const jwtRefreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, jwtAccessTokenSecret, {
    expiresIn: "10m", // 通行鑰匙 10 分鐘到期
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, jwtRefreshTokenSecret, {
    expiresIn: "1d", // 重登鑰匙 1 天到期
  });
};

/** 解碼 通行JWT 並返回內容 */
const decodeAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtAccessTokenSecret);
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

/** 解碼 重登JWT 返回用戶資料 */
const decodeRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtRefreshTokenSecret);
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

/** 將用戶資料轉為 JWT */
const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

module.exports = {
  decodeAccessToken,
  decodeRefreshToken,
  generateTokens,
};
