const User = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (userData) => {
  console.log(userData);
  userData.password = await bcrypt.hash(userData.password, 10);
  console.log(userData);
  //   return "OK"; // 先不要送出，看一下密碼有沒有被雜湊
  return User.create(userData);
};

const getUserByEmail = (email) => {
  return User.findOne(
    { email: email },
    { password: 1 }
  ).exec()
};

const getUserById = (id) => {
  return User.findOne(
    { _id: id },
    { password: 1 }
  ).exec()
};

module.exports = {
  register,
  getUserByEmail,
  getUserById,
};
