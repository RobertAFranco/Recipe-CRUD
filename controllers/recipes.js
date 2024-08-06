

import Recipe from '../models/recipe.js'

const index = async (req, res) => {
    const allRecipes = await Recipe.find();
    res.render("recipes/index.ejs", {recipes: allRecipes});
}

const newRecipes = async (req, res) => {
    const allRecipes = await Recipe.find();
    res.render("recipes/new.ejs", {recipes: allRecipes});
}

export {
    index, newRecipes
}