const express = require("express");
const router = express.Router();
const recipeService = require("../../functions/recipe/service.js");
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

module.exports = router;
