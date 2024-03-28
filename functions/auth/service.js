const userService = require("../user/service");
const authorService = require("../author/service");
const util = require("../../common/utils");
const bcrypt = require("bcrypt");
const token = require("../jwt-token/service");
const createError = require("http-errors");
module.exports.registerUser = async (data) => {
  const { email, password, name } = data;
  // Check if email is valid
  if (!util.isValidEmail(email)) {
    throw new Error("Invalid email");
  }
  // Check if password is between 6 and 15 characters
  if (password.length < 6 && password.length > 15) {
    throw new Error("Password must be between 6 and 15 characters");
  }
  // Check if user already exists
  const user = await userService.searchUser({ email });
  if (user || user !== null) {
    throw new createError(409, "User already exists");
  }
  let createdUser, createdAuthor;
  try {
    createdUser = await userService.createUser({ email, password, name });
  } catch (error) {
    throw new createError(500, "Internal server error: Error creating user");
  }
  /**
   * I don't really like doing this kind of things, create author doesn't belong here
   * but since i'm not using a microservice architecture, i'm going to do it here
   */
  try {
    createdAuthor = await authorService.createAuthor({
      email,
      name,
      userId: createdUser._id,
    });
  } catch (error) {
    console.log(error);
    throw new createError(500, "Internal server error: Error creating author");
  }
  return {
    user: {
      email: createdUser.email,
      name: createdUser.name,
    },
    author: {
      email: createdAuthor.email,
      name: createdAuthor.name,
    },
    token: createdUser.token,
  };
};

module.exports.loginUser = async (data) => {
  const { email, password } = data;
  if (!util.isValidEmail(email)) {
    throw new createError(400, "Invalid email");
  }
  const user = await userService.searchUser({ email });
  let userAccessToken = user.token;
  if (!user) {
    throw new createError(404, "User not found");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new createError(401, "Invalid password");
  }
  const verifyToken = token.verifyToken(user.token);
  if (!verifyToken) {
    userAccessToken = await userService.refreshToken({ email });
  }
  return { token: userAccessToken };
};
