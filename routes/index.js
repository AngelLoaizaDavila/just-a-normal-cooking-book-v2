const authService = require("../functions/auth/service");

export default function (router) {
  router.post("/register", registerUser);
}

async function registerUser(req, res) {
  res.setHeader("content-type", "application/json");
  const { email, password, name } = req.body;
  try {
    const registeredUser = await authService.registerUser({
      email,
      password,
      name,
    });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
}
