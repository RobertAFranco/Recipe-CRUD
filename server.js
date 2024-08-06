import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import Recipe from "./models/recipe.js"

import authController from './controllers/auth.js';

import * as recipesCtrl from "./controllers/recipes.js"

dotenv.config();
const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "2000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use(morgan('dev'));

// Routes
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.get("/recipes/new", recipesCtrl.newRecipes);


// GET 
app.get("/recipes", recipesCtrl.index);
    
  
// POST 
app.post("/recipes", async (req, res) => {
    if (req.body.isReadyToCook === "on") {
      req.body.isReadyToCook= true;
    } else {
      req.body.isReadyToCook = false;
    }
    await Recipe.create(req.body);
    res.redirect("/recipes");
  });
  
  app.get("/recipes/:recipeId", async (req, res) => {
    const foundRecipe = await Recipe.findById(req.params.recipeId);
    res.render("recipes/show.ejs", {recipe: foundRecipe});
  });

  app.delete("/recipes/:recipeId", async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect("/recipes");
  });

  app.get("/recipes/:recipeId/edit", async (req, res) => {
    const foundRecipe = await Recipe.findById(req.params.recipeId);
    res.render("recipes/edit.ejs", {
      recipe: foundRecipe,
    });
  });

  // server.js

app.put("/recipes/:recipeId", async (req, res) => {
  
    if (req.body.isReadyToCook === "on") {
      req.body.isReadyToCook = true;
    } else {
      req.body.isReadyToCook = false;
    }
    
    
    await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
  
    
    res.redirect(`/recipes/${req.params.recipeId}`);
  });
  



app.use('/auth', authController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});