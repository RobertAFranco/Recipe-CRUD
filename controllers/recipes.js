const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// GET /Recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({}).populate('owner');
    res.render('recipes/index', { recipes });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).send('Internal Server Error');
  }
});

// GET /recipes/new
router.get('/new', (req, res) => {
  res.render('recipes/new');
});

// GET /recipes/:recipeId
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('owner');
    
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    const userHasFavorited = recipe.favoritedByUsers.some(user => user.equals(req.session.user._id));

    res.render('recipes/show', { 
      recipe, 
      userHasFavorited 
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.redirect('/');
  }
});

// POST /recipes
router.post('/', async (req, res) => {
  try {
    const { name, ingredients, instructions, tips} = req.body;

    if (!name || !ingredients || !instructions || !tips) {
      return res.status(400).send('All fields are required.');
    }

    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const newRecipe = new Recipe({
      name,
      ingredients,
      instructions,
      tips,
      owner: req.session.user._id
    });

    await newRecipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).send('Error creating recipe.');
  }
});

// DELETE /recipes/:recipesId
router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return res.status(404).send('Recipe not found.');
    }

    if (recipe.owner.equals(req.session.user._id)) {
      await recipe.deleteOne();
      res.redirect('/recipes');
    } else {
      res.status(403).send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.redirect('/');
  }
});

// PUT /recipes/:recipeId
router.put('/:recipeId', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId);

    if (!currentRecipe) {
      return res.status(404).send('Recipe not found');
    }

    if (currentRecipe.owner.equals(req.session.user._id)) {
      await currentRecipe.updateOne(req.body);
      res.redirect('/recipes');
    } else {
      res.status(403).send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.redirect('/');
  }
});
// controllers/recipes.js

router.get('/:recipeId/edit', async (req, res) => {
    try {
      const currentRecipe = await Recipe.findById(req.params.recipeId);
      res.render('recipes/edit.ejs', {
        recipe: currentRecipe,
      });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  

// POST /recipes/:recipesId/favorited-by/:userId
router.post('/:recipeId/favorited-by/:userId', async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $push: { favoritedByUsers: req.params.userId }
    });
    res.redirect(`/recipes/${req.params.recipeId}`);
  } catch (error) {
    console.error('Error favoriting recipe:', error);
    res.redirect('/');
  }
});

// DELETE /recipes/:recipeId/favorited-by/:userId
router.delete('/:recipeId/favorited-by/:userId', async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $pull: { favoritedByUsers: req.params.userId }
    });
    res.redirect(`/recipes/${req.params.recipeId}`);
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.redirect('/');
  }
});

module.exports = router;

