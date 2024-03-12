const userService = require("../../functions/user/service");
const tokenService = require("../../functions/jwt-token/service");
require("dotenv").config({ path: "../../.env" });

const main = async () => {
  const user = {
    email: "test@test.com",
    password: "test",
    name: "test",
  };

  const userCreated = await userService.createUser(user);
  console.log(tokenService.verifyToken(userCreated.token));
  return userCreated;
};

main()