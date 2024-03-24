const userService = require("../user/service");
const authorService = require("../author/service");
const util = require("../../common/utils");
const bcrypt = require("bcrypt");
const token = require("../jwt-token/service");
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
    throw new Error("User already exists");
  }
  try {
    const createdUser = await userService.createUser({ email, password, name });
    const createdAuthor = await authorService.createAuthor({
      email,
      name,
      userId: createdUser._id,
    });
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
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
};

module.exports.loginUser = async (data) => {
  const { email, password } = data;
  if (!util.isValidEmail(email)) {
    throw new Error("Invalid email");
  }
  const user = await userService.searchUser({ email });
  let userAccessToken = user.token;
  if (!user) {
    throw new Error("User not found");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Incorrect password");
  }
  const verifyToken = token.verifyToken(user.token);
  if (!verifyToken) {
    userAccessToken = await userService.refreshToken({ email });
  }
  return userAccessToken;
};
