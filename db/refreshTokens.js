const { RefreshToken } = require("../models/RefreshToken");

const storeRefreshToken = async (token, userId) => {
  return await RefreshToken.create({
    token: token,
    userId: userId,
  });
};

module.exports = {
  storeRefreshToken,
};
