const Author = require("../../common/author-model");
const AuthorRecipe = require("../../common/author-recipe-model");
const mongo = require("../../common/db/mongo");
const createError = require("http-errors");

module.exports.createAuthorRecipeWithAuthorEmail = async (data) => {
  const { authorEmail, recipe } = data;
  if (!authorEmail || !recipe) {
    throw createError(400, "missing required params");
  }
  await mongo.init();
  // Check if author exists
  const authorExists = await Author.findOne({ email: authorEmail });
  if (!authorExists) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  // Check if recipe already exists
  const alreadyExistsRecipe = await AuthorRecipe.findOne({
    author: authorExists._id,
    name: recipe.name,
  });
  if (alreadyExistsRecipe !== null) {
    await mongo.disconnect();
    throw createError(400, "Recipe already exists");
  }
  // Create recipe
  const authorRecipe = new AuthorRecipe({
    author: authorExists._id,
    name: recipe.name,
    ingredients: recipe.ingredients,
    steps: parseSteps(recipe.steps),
    portions: recipe.portions,
    cookingTime: recipe.cookingTime,
  });
  // Save recipe
  const createdRecipe = await authorRecipe.save();
  // Add recipe to author's recipes
  await authorExists.recipes.push(createdRecipe._id);
  await authorExists.save();
  await mongo.disconnect();
  return createdRecipe;
};
// Receives an array of strings and returns an array of objects
const parseSteps = (steps) => {
  return steps.map((step, index) => {
    return {
      step: index,
      description: step,
    };
  });
};

module.exports.searchAuthorRecipeWithAuthorEmail = async (data) => {
  const { authorEmail, recipeName } = data;
  if (!authorEmail || !recipeName) {
    throw createError(400, "missing required params");
  }

  await mongo.init();
  const authorExists = await Author.findOne({ email: authorEmail });
  if (!authorExists) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  const recipe = await AuthorRecipe.findOne({
    author: authorExists._id,
    name: recipeName,
  });
  if (!recipe) {
    await mongo.disconnect();
    throw createError(404, "Recipe not found");
  }
  await mongo.disconnect();
  return recipe;
};
module.exports.findAllAuthorRecipesWithAuthorEmail = async (data) => {
  const { authorEmail, limit, offset } = data;
  if (!authorEmail) {
    throw createError(400, "missing required params");
  }
  await mongo.init();
  // Check if author exists
  const authorExists = await Author.findOne({ email: authorEmail });
  // If author does not exist, return error
  if (!authorExists) {
    await mongo.disconnect();
    throw createError(404, "Author not found");
  }
  // Find all recipes from author
  const recipes = await AuthorRecipe.find({ author: authorExists._id })
    .skip(offset ? offset : 0)
    .limit(limit ? limit : 20);
  // If there are no recipes, return error
  if (!recipes || recipes.length === 0) {
    await mongo.disconnect();
    throw createError(404, "No recipes found");
  }
  await mongo.disconnect();
  return recipes;
};

module.exports.updateAuthorRecipeWithAuthorEmail = async (data) => {
  const { authorEmail, name, ingredients, steps, portions, cookingTime } = data;
  if (!name) {
    throw createError(400, "missing required params");
  }
  await db.init();
  // Check if author exists
  const author = await Author.findOne({ email: authorEmail });
  if (!author) {
    await db.disconnect();
    throw createError(404, "Author does not exist");
  }
  // Check if recipe exists
  const recipe = await AuthorRecipe.findOne({ author: author._id, name: name });
  if (!recipe) {
    // TODO -> Control db init and disconnect on router
    await db.disconnect();
    throw createError(404, "Recipe does not exist");
  }
  const dataToBeUpdated = {};
  if (ingredients && ingredients !== null && ingredients !== undefined) {
    const updatedIngredients = await updateIngredients(recipe, ingredients);
    if (updatedIngredients !== null) {
      dataToBeUpdated.ingredients = updatedIngredients;
    }
  }
  if (steps && steps !== null && steps !== undefined) {
    const updatedSteps = await updateSteps(recipe, steps);
    if (updatedSteps !== null) {
      dataToBeUpdated.steps = updatedSteps;
    }
  }
  if (portions && portions !== null && portions !== undefined) {
    // portions -> number
    dataToBeUpdated.portions = portions;
  }
  if (cookingTime && cookingTime !== null && cookingTime !== undefined) {
    /**
     * cookingTime: {
     *  time: number,
     *  unit: string
     * }
     */
    dataToBeUpdated.cookingTime = {
      time: cookingTime.time,
      unit: cookingTime.unit,
    };
  }
  // If there is no data to be updated, return error
  if (Object.keys(dataToBeUpdated).length === 0) {
    // TODO -> Control db init and disconnect on router
    await db.disconnect();
    throw createError(
      400,
      "Recipe could't be updated because there is no data to be updated"
    );
  }

  await AuthorRecipe.updateOne(
    {
      _id: recipe._id,
    },
    {
      $set: dataToBeUpdated,
    }
  );
  await db.disconnect();
  return dataToBeUpdated;
};

module.exports.deleteAuthorRecipeWithAuthorEmail = async (data) => {
  const { authorEmail, name } = data;
  if (!authorEmail || !name) {
    throw createError(400, "missing required params");
  }
  await mongo.init();
  // Check if author exists
  const author = await Author.findOne({ email: authorEmail });
  if (!author) {
    await mongo.disconnect();
    throw createError(404, "Author does not exist");
  }
  // Check if recipe exists
  const recipe = await AuthorRecipe.findOne({ author: author._id, name: name });
  if (!recipe) {
    await mongo.disconnect();
    throw createError(404, "Recipe does not exist");
  }
  // Remove recipe from recipes collection
  await AuthorRecipe.deleteOne({ _id: recipe._id });
  // Remove recipe from author's recipes
  const filteredRecipes = author.recipes.filter((item) => item !== recipe._id);
  await Author.updateOne(
    { _id: author._id },
    { $set: { recipes: filteredRecipes } }
  );
  await mongo.disconnect();
  return {
    message: "Recipe deleted successfully",
  };
};
// AUXILIARY METHODS
const updateSteps = async (recipe, steps) => {
  /**
   * steps: [
   *  {
   *    step: number,
   *    description: string
   *  }
   * ]
   */

  const recipeSteps = recipe.steps;
  if (!Array.isArray(steps)) {
    return null;
  }
  const updatedSteps = [];
  for (let i = 0; i < recipeSteps.length; i++) {
    const step = recipeSteps[i];
    const alreadyExistsStep = steps.find((item) => item.step === step.step);
    if (!alreadyExistsStep) {
      updatedSteps.push(step);
      continue;
    }
    if (alreadyExistsStep) {
      updatedSteps.push({
        step: step.step,
        description: alreadyExistsStep.description,
      });
      continue;
    }
  }
  return updatedSteps;
};

const updateIngredients = async (recipe, ingredients) => {
  /**
   * ingredients: [
   *  {
   *    oldName: string,
   *    newName: string,
   *    quantity: number,
   *    unit: string
   *  }
   * ]
   */

  if (!Array.isArray(ingredients)) {
    return null;
  }

  const updatedIngredients = [];
  for (let i = 0; i < recipe.ingredients.length; i++) {
    // oldIngredient
    const ingredient = recipe.ingredient[i];
    // newIngredient -> if exists and has been modified
    const existIngredient = ingredients.find(
      (item) => item.oldName === ingredient.name
    );
    // If ingredient does not exist in modified ingredients array, maintain it
    if (!existIngredient) {
      updatedIngredients.push(ingredient);
      continue;
    }
    // If ingredient exist in modified ingredients array, modify and save it
    if (existIngredient) {
      updatedIngredients.push(
        checkIngredientModificationAndReturnModifiedIngredient(
          ingredient,
          existIngredient
        )
      );
    }
  }
  return updatedIngredients;
};

const checkIngredientModificationAndReturnModifiedIngredient = (
  oldIngredient,
  newIngredient
) => {
  return {
    name:
      newIngredient.newName !== null && newIngredient.newName !== undefined
        ? newIngredient.newName
        : oldIngredient.oldName,
    quantity:
      newIngredient.quantity !== null && newIngredient.quantity !== undefined
        ? newIngredient.quantity
        : oldIngredient.quantity,
    unit:
      newIngredient.unit !== null && newIngredient.unit !== undefined
        ? newIngredient.unit
        : oldIngredient.unit,
  };
};
