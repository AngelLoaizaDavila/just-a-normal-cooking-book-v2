const userService = require("../../functions/user/service");
const tokenService = require("../../functions/jwt-token/service");
require("dotenv").config({ path: "../../.env" });

const main = async () => {
  const user = {
    email: "testcreated001@test.com",
    password: "test001",
    name: "test001",
  };

  const userCreated = await userService.createUser(user);
  console.log(tokenService.verifyToken(userCreated.token));
  return userCreated;
};

main()