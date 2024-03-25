const Recipe = require("../../common/recipe-model");
const db = require("../../common/db/mongo");
const createError = require("http-errors");

module.exports.searchRecipe = async (data) => {
  const { name } = data;
  if (!name || name === null || name === undefined) {
    throw createError(400, "Missing required param");
  }
  await db.init();
  const recipe = await Recipe.findOne({
    name: name,
  });
  await db.disconnect();
  if (!recipe) {
    // TODO -> Control db init and disconnect on router
    await db.disconnect();
    throw createError(404, "Recipe not found");
  }
  await db.disconnect();
  return recipe;
};

module.exports.findRecipes = async (data) => {
  const { limit, offset } = data || {};

  await db.init();
  const recipes = await Recipe.find({})
    .skip(offset ? offset : 0)
    .limit(limit ? limit : 20);
  if (!recipes || recipes.length === 0) {
    // TODO -> Control db init and disconnect on router
    await db.disconnect();
    throw createError(404, "No recipes where found");
  }
  await db.disconnect();
  return recipes;
};

module.exports.createRecipe = async (data) => {
  const { name, ingredients, steps, portions, cookingTime } = data;
  console.log({ data });
  if (!name || !ingredients || !steps || !portions || !cookingTime) {
    throw createError(400, "missing required params");
  }

  await db.init();
  const alreadyExists = await Recipe.findOne({ name: name });
  if (alreadyExists !== null) {
    // TODO -> Control db init and disconnect on router
    await db.disconnect();
    throw createError(400, "Recipe already exists");
  }
  const recipe = new Recipe({
    name: name,
    ingredients: ingredients,
    steps: parseSteps(steps),
    portions: portions,
    cookingTime: cookingTime,
  });
  await recipe.save();
  await db.disconnect();
  return recipe;
};
const parseSteps = (steps) => {
  return steps.map((item, index) => {
    return {
      step: index,
      description: item,
    };
  });
};

module.exports.updateRecipe = async (data) => {
  const { name, ingredients, steps, portions, cookingTime } = data;
  if (!name) {
    throw createError(400, "missing required params");
  }
  await db.init();

  const recipe = await Recipe.findOne({ name: name });
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
  if (Object.keys(dataToBeUpdated).length === 0) {
    // TODO -> Control db init and disconnect on router
    await db.disconnect();
    throw createError(
      400,
      "Recipe could't be updated because there is no data to be updated"
    );
  }

  await Recipe.updateOne(
    {
      name: recipe.name,
    },
    {
      $set: dataToBeUpdated,
    }
  );
  await db.disconnect();
  return dataToBeUpdated;
};

module.exports.deleteRecipe = async (data) => {
  const { name } = data;
  if (!name || name === null || name === undefined) {
    throw createError(400, "Missing required params");
  }
  await db.init();
  const recipe = await Recipe.findOne({ name: name });
  if (!recipe) {
    throw createError(400, "The recipe you are trying to delete doesn't exist");
  }
  if (recipe.deleted === true) {
    // TODO -> Control db init and disconnect on router
    await db.disconnect();
    throw createError(
      400,
      "The recipe you are trying to delete is already deleted"
    );
  }
  await Recipe.updateOne(
    {
      name: name,
    },
    {
      $set: {
        deleted: true,
      },
    }
  );
  await db.disconnect();
  return {
    message: `Recipe "${name}", has been successfully deleted`,
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
