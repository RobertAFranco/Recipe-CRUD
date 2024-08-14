///user.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe.js');

// Profile route
router.get('/profile', async (req, res) => {
  try {
    // Ensure the user is authenticated and has session data
    if (!req.session.user || !req.session.user._id) {
      throw new Error('User is not authenticated');
    }

    const userId = req.session.user._id;

    // Find RECIPES owned by the user
    const myRecipes = await Recipe.find({ owner: userId }).populate('owner');

    // Find RECIPES favorited by the user
    const myFavoriteRecipes = await Recipe.find({ favoritedByUsers: userId }).populate('owner');

    
    res.render('users/show.ejs', {
      myRecipes,
      myFavoriteRecipes,

     
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Provide user-friendly feedback or redirect to an error page
    res.redirect('/error'); // Or render an error page if you have one
  }
});

module.exports = router;