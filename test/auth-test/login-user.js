const authService = require('../../functions/auth/service');
require("dotenv").config({ path: "../../.env" });

const main = async () => {
  const user = {
    email: "testcreated003@test.com",
    password: "test003"
  };

  const userCreated = await authService.loginUser(user);
  // console.log(tokenService.verifyToken(userCreated.token));
  console.log(userCreated);
  return userCreated;
};

main()