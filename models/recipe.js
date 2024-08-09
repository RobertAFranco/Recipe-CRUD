

import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: String,
    incredients: String,
    instructions: String,
    //owner://
    //favorited:
    isReadyToCook: Boolean,
  });

  const Recipe = mongoose.model("Recipe", recipeSchema); // create model

  export default Recipe;