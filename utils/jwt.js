const jwt = require("jsonwebtoken");
const handleErrorAsync = require('./handleErrorAsync');
const User = require('../models/user');
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

/** 洧杰老師的code >> 驗證使用者 **/
const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(appError(401, '你尚未登入！', next));
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err)
      } else {
        resolve(payload)
      }
    })
  })
  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;
  next();
});

/** 洧杰老師的code >> 簽發JWT token **/
const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_DAY
    });
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      user: {
        token,
        name: user.name
      }
    });
  } catch (error) {
    console.error(error);
    // Expected output: ReferenceError: nonExistentFunction is not defined
    // (Note: the exact output may be browser-dependent)
  }

}

module.exports = {
  decodeAccessToken,
  decodeRefreshToken,
  generateTokens,
  isAuth,
  generateSendJWT,
};
