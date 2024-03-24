const authService = require('../../functions/auth/service');
require("dotenv").config({ path: "../../.env" });

const main = async () => {
  const user = {
    email: "testcreated003@test.com",
    password: "test003",
    name: "test003",
  };

  const userCreated = await authService.registerUser(user);
  // console.log(tokenService.verifyToken(userCreated.token));
  return userCreated;
};

main()