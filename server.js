// ------------------------------------------------------------
// ------------------------------------------------------------
// File name     : server.js
// Student name  : Andara Pintuge Menuka Shewon Aquinas Pinto
// Student ID    : 200574919
// Date          : 23rd February 2024
// ------------------------------------------------------------
// ------------------------------------------------------------

const express = require('express');
const bodyParser = require('body-parser');
const recipes = require('./recipes.json');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Using files from the 'public' directory
app.use(express.static('public'));



// ------------------------------
//  ------- API Endpoints -------
// ------------------------------

//  ------ Get All Recipes ----------
app.get('/recipes', (req, res) => {
    // Only including certian parameters
    const simplifiedRecipes = recipes.map(recipe => ({
        recipeId: recipe.recipeId,
        title: recipe.title,
        cuisine: recipe.cuisine
    }));
    res.json(simplifiedRecipes);
});

// -------- Get All Ingredients --------
app.get('/ingredients', (req, res) => {
    // Remove duplicates
    const allIngredients = recipes.reduce((acc, recipe) => {
        acc.push(...recipe.ingredients);
        return acc;
    }, []);

    const uniqueIngredients = [...new Set(allIngredients)];
    res.json(uniqueIngredients);
});

// --------- Get Recipes by Cuisine ---------------
app.get('/recipes/cuisine/:cuisine', (req, res) => {
    // Filter logic
    const { cuisine } = req.params;
    const filteredRecipes = recipes.filter(recipe => recipe.cuisine.toLowerCase() === cuisine.toLowerCase());
    res.json(filteredRecipes);
});

// --------- Get Details about a Recipe ---------------
app.get('/recipe/:recipeId', (req, res) => {
    // Find by ID
    const { recipeId } = req.params;
    const recipe = recipes.find(recipe => recipe.recipeId === parseInt(recipeId));
    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});

// ------ Get Details about Ingredient --------------
app.get('/ingredient/:ingredientName', (req, res) => {
    // Find the ingredient
    const { ingredientName } = req.params;
    const recipesWithIngredient = recipes.filter(recipe => recipe.ingredients.includes(ingredientName));
    if (recipesWithIngredient.length > 0) {
        res.json(recipesWithIngredient);
    } else {
        res.status(404).json({ message: 'Ingredient not found in any recipes' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});