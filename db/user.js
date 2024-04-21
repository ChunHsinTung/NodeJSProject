const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (userData) => {
  console.log(userData);
  userData.password = await bcrypt.hash(userData.password, 10);
  console.log(userData);
  //   return "OK"; // 先不要送出，看一下密碼有沒有被雜湊
  return User.create(userData);
};

const getUserByEmail = async (email) => {
  return await User.where("email").equals(email).findOne().exec();
};

module.exports = {
  register,
  getUserByEmail,
};
