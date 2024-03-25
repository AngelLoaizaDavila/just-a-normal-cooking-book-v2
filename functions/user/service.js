const User = require("../../common/user-model");
const bcrypt = require("bcrypt");
const token = require("../jwt-token/service");
const mongo = require("../../common/db/mongo");
const mongoose = require("mongoose");

module.exports.createUser = async (data) => {
  const { email, password, name } = data;
  await mongo.init();
  const alreadyExists = await User.findOne({ email, deleted: false });
  if (alreadyExists) {
    await mongo.disconnect();
    throw new Error("User already exists");
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userId = new mongoose.Types.ObjectId();
  const jwtToken = token.generateToken({
    email,
    userId: userId.toString(),
    role: "USER",
    date: Date.now(),
  });
  const user = new User({
    _id: userId,
    email,
    password: hashedPassword,
    name: name.trim(),
    token: jwtToken,
  });
  await user.save();
  await mongo.disconnect();
  return user;
};

module.exports.searchUser = async (data) => {
  const { email } = data;
  await mongo.init();
  const user = await User.findOne({ email, deleted: false });
  if (!user) {
    await mongo.disconnect();
    return null;
  }
  await mongo.disconnect();
  return user;
};

module.exports.updateUser = async (data) => {
  const { email, password, name } = data;
  await mongo.init();
  const user = await User.findOne({ email, deleted: false });
  if (!user) {
    await mongo.disconnect();
    throw new Error("User not found");
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userPassModified = await bcrypt.compare(password, user.password);
  if (userPassModified) {
    user.password = hashedPassword;
  }

  name.trim() !== user.name ? (user.name = name.trim()) : null;
  await user.save();
  await mongo.disconnect();
  return user;
};

module.exports.refreshToken = async (data) => {
  const { email } = data;
  await mongo.init();
  const user = await User.findOne({ email, deleted: false });
  if (!user) {
    await mongo.disconnect();
    throw new Error("User not found");
  }
  const jwtToken = token.generateToken({
    email,
    userId: user._id,
    role: "USER",
    date: Date.now(),
  });
  user.token = jwtToken;
  await user.save();
  await mongo.disconnect();
  return { accessToken: user.token };
};

module.exports.deleteUser = async (data) => {
  const { email } = data;
  await mongo.init();
  const user = await User.findOne({ email, deleted: false });
  if (!user) {
    await mongo.disconnect();
    throw new Error("User not found");
  }
  user.deleted = true;
  await user.save();
  await mongo.disconnect();
  return {
    message: "User deleted successfully",
  };
};
