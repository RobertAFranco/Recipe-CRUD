

import mongoose from "mongoose";

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToCook: Boolean,
  });

  const Recipe = mongoose.model("Recipe", recipeSchema); // create model

  export default Recipe;