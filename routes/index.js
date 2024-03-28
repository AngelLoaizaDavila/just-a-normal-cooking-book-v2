const authService = require("../functions/auth/service");
const authorService = require("../functions/author/service");
const authorRecipeService = require("../functions/author-recipe/service");
const recipeService = require("../functions/recipe/service");
const utils = require("../common/utils");
const middleware = require("../routes/middleware");
const express = require("express");
const router = express.Router();

// Register and Login routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Author routes
router.get("/author", middleware.authenticateToken, getMeAuthorProfile);
router.get("/author/recipes", middleware.authenticateToken, getMyRecipes);

// recipes routes
router.get("/recipes", getRecipes);

async function registerUser(req, res) {
  const { email, password, name } = req.body;
  try {
    const registeredUser = await authService.registerUser({
      email,
      password,
      name,
    });
    const response = utils.formatResponse(registeredUser);
    res.set(response.headers);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    handleError(error, res);
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const loggedUser = await authService.loginUser({ email, password });
    const response = utils.formatResponse(loggedUser);
    console.log({ response });
    res.set(response.headers);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    handleError(error, res);
  }
}

async function getMeAuthorProfile(req, res) {
  const user = req.user;
  try {
    const authorProfile = await authorService.searchAuthorWithUserId(
      {userId: user.userId}
    );
    const response = utils.formatResponse(authorProfile);
    res.set(response.headers);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    handleError(error, res);
  }
}

async function getMyRecipes(req, res) {
  const user = req.user;
  const { limit, offset } = req.query;
  try {
    const recipes = await authorRecipeService.findAllAuthorRecipesWithUserId({
      userId: user.userId,
      limit,
      offset,
    });
    const response = utils.formatResponse(recipes);
    res.set(response.headers);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    handleError(error, res);
  }
}

async function getRecipes(req, res) {
  const { limit, offset } = req.query;
  try {
    const recipes = await recipeService.findRecipes({ limit, offset });
    const response = utils.formatResponse(recipes);
    res.set(response.headers);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    handleError(error, res);
  }
}

function handleError(err, res) {
  console.error(err);
  res.setHeader("content-type", "application/json");
  res.status(err.status).send({ message: err.message });
}

module.exports = router;