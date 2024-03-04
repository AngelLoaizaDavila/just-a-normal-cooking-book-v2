const authorRecipe = require("../functions/author-recipe/service");
const mongo = require("../common/db/mongo");
require("dotenv").config({ path: "../.env" });

const dummyAuthorRecipe = {
  authorEmail: "brookebriggs@mixers.com",
  recipe: {
    name: "Pasta",
    ingredients: [
      {
        name: "Pasta",
        quantity: "400",
        unit: "g",
      },
      {
        name: "Onion",
        quantity: "1",
        unit: "pc",
      },
      {
        name: "Garlic",
        quantity: "2",
        unit: "cloves",
      },
      {
        name: "Tomato",
        quantity: "2",
        unit: "pc",
      },
      {
        name: "Olive oil",
        quantity: "2",
        unit: "tbsp",
      },
      {
        name: "Basil",
        quantity: "1",
        unit: "tbsp",
      },
      {
        name: "Salt",
        quantity: "1",
        unit: "tsp",
      },
      {
        name: "Pepper",
        quantity: "1",
        unit: "tsp",
      },
    ],
    steps: [
      "Boil the pasta",
      "Chop the onion, garlic, and tomato",
      "Fry the onion and garlic in olive oil",
      "Add the tomato and cook for 5 minutes",
      "Add the pasta and mix",
      "Add salt, pepper, and basil",
    ],
    portions: 4,
    cookingTime: 30,
  },
};

const createAuthorRecipe = async (data) => {
  await authorRecipe.createAuthorRecipe(data);
};

const main = async () => {
  await createAuthorRecipe(dummyAuthorRecipe);
};

main();
