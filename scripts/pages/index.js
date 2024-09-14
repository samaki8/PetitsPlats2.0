// index.js
import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
/*
document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const recipes = await fetchRecipes();
    recipeCardsContainer.innerHTML = recipes.map(createRecipeCard).join('');
});*/


document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const recipes = await fetchRecipes();
    recipeCardsContainer.innerHTML = recipes.map(createRecipeCard).join('');
});