const Author = require("../../common/author-model");
const AuthorRecipe = require("../../common/author-recipe-model");
const mongo = require("../../common/db/mongo");
const createError = require("http-errors");

module.exports.createAuthorRecipe = async (data) => {
  const { authorEmail, recipe } = data;
  if (!authorEmail || !recipe) {
    throw createError(400, "missing required params");
  }

  await mongo.init();
  const authorExists = await Author.findOne({ email: authorEmail });
  if (!authorExists) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  const alreadyExistsRecipe = await AuthorRecipe.findOne({
    author: authorExists._id,
    name: recipe.name,
  });
  if (alreadyExistsRecipe !== null) {
    await mongo.disconnect();
    throw createError(400, "Recipe already exists");
  }
  const authorRecipe = new AuthorRecipe({
    author: authorExists._id,
    name: recipe.name,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    portions: recipe.portions,
    cookingTime: recipe.cookingTime,
  })
  const createdRecipe = await authorRecipe.save();
  await authorExists.recipes.push(createdRecipe._id);
  await authorExists.save();
  await mongo.disconnect();
  return createdRecipe;
};
