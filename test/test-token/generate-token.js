const token = require("../../functions/jwt-token/service");
require("dotenv").config({ path: "../../.env" });

const main = () => {
  const createdToken = token.generateToken({
    email: "test@test.com",
    id: 'asdgasdfg',
    date: Date.now(),
  });
  const validateToken = token.verifyToken(createdToken);
  console.log({ createdToken, validateToken });
};
main();
