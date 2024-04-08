const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const config = useRuntimeConfig();

  return jwt.sign({ userId: user.id }, config.jwtAccessTokenSecret, {
    expiresIn: "10m",
  });
};

const generateRefreshToken = (user) => {
  const config = useRuntimeConfig();

  return jwt.sign({ userId: user.id }, config.jwtRefreshTokenSecret, {
    expiresIn: "4h",
  });
};

const decodeAccessToken = (token) => {
  const config = useRuntimeConfig();

  try {
    return jwt.verify(token, config.jwtAccessTokenSecret);
  } catch (error) {
    return null;
  }
};

/** 解碼 JWT 獲取用戶資料 */
const decodeRefreshToken = (token) => {
  const config = useRuntimeConfig();

  try {
    return jwt.verify(token, config.jwtRefreshTokenSecret);
  } catch (error) {
    console.log(error.message);
    return error.message;
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
