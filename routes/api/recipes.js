const express = require("express");
const router = express.Router();
const recipeService = require("../../functions/recipe/service.js");
const authorService = require("../../functions/author/service.js");
const authorRecipeService = require("../../functions/author-recipe/service.js");
const authService = require('../../functions/auth/service.js')

/*
 * All routes that have an email param will be replaced by the internal id
 * of the element. This is just for the sake of simplicity and because the login and authentication
 * is not implemented yet.
 * All of those routes will be replaced by a /me route that will be used to get the user id from the token
 */

// RECIPE ROUTES

// Search for a recipe
router.get("/recipe/:name", (req, res) => {
  recipeService
    .searchRecipe({ name: req.params.name })
    .then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Search for all recipes
router.get("/recipes", (req, res) => {
  recipeService
    .findRecipes({ limit: req.query.limit, offset: req.query.offset })
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Create a recipe
router.post("/recipe", (req, res) => {
  recipeService
    .createRecipe(req.body)
    .then((recipe) => {
      res.status(201).json(recipe);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Update a recipe
router.put("/recipe/:name", (req, res) => {
  recipeService
    .updateRecipe(req.params.name, req.body)
    .then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Delete a recipe
router.delete("/recipe/:name", (req, res) => {
  recipeService
    .deleteRecipe(req.params.name)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// AUTHOR ROUTES

// Create an author
router.post("/author", (req, res) => {
  authorService
    .createAuthor(req.body)
    .then((author) => {
      res.status(201).json(author);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Search for an author
router.get("/author/:email", (req, res) => {
  authorService
    .searchAuthorWithAuthorEmail({ email: req.params.email })
    .then((author) => {
      res.status(200).json(author);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Search for all recipes from an author
router.get("/author/:email/recipes", (req, res) => {
  authorService
    .searchAuthorAndPopulateRecipeWithAuthorEmail({ email: req.params.email })
    .then((author) => {
      res.status(200).json(author);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Delete an author
router.delete("/author/:email", (req, res) => {
  authorService
    .deleteAuthorWithAuthorEmail({ authorEmail: req.params.email })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Update an author
router.update("/author/:email", (req, res) => {
  authorService
    .updateAuthorWithAuthorEmail({ authorEmail: req.params.email })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// AUTHOR-RECIPE ROUTES

// Search for a recipe from an author
router.get("/author-recipe/:email/:name", (req, res) => {
  authorRecipeService
    .searchAuthorRecipeWithAuthorEmail({
      authorEmail: req.params.email,
      name: req.params.name,
    })
    .then((authorRecipe) => {
      res.status(200).json(authorRecipe);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Search for all recipes from an author
router.get("/author-recipe/:email", (req, res) => {
  authorRecipeService
    .findAllAuthorRecipesWithAuthorEmail({
      authorEmail: req.params.email,
      limit: req.query.limit,
      offset: req.query.offset,
    })
    .then((authorRecipe) => {
      res.status(200).json(authorRecipe);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Delete a recipe from an author
router.delete("/author-recipe/:email/:name", (req, res) => {
  authorRecipeService
    .deleteAuthorRecipeWithAuthorEmail({
      authorEmail: req.params.email,
      name: req.params.name,
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Update a recipe from an author
router.update("/author-recipe/:email/:name", (req, res) => {
  authorRecipeService
    .updateAuthorRecipeWithAuthorEmail({
      authorEmail: req.params.email,
      name: req.params.name,
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Create a recipe from an author
router.post("/author-recipe", (req, res) => {
  authorRecipeService
    .createAuthorRecipeWithAuthorEmail(req.body)
    .then((authorRecipe) => {
      res.status(201).json(authorRecipe);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});


// LOGIN AND REGISTER ROUTES

// Register a user
/**
 * This function will try to create a user and his author account in the same method
 * this is not recommended since it's not a good practice to do this in the same method 
 */
router.post("/register", (req, res) => {
  authService
    .registerUser(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});

// Login a user
/**
 * This function will try to renew the token if it's expired, so it may take a little longer
 * to login the user, will be moving to a microservice architecture in the future
 */
router.post("/login", (req, res) => {
  authService
    .loginUser(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
});
module.exports = router;
