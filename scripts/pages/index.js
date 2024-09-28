// index.js

import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters } from '../models/filtres.js';
import { filterByMainSearch } from '../models/search.js';
import { searchRecipes } from '../models/search.js';
import { applyFilters } from '../models/filtres.js';


document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const tagsContainer = document.getElementById('tags-container');
   // const recipes = await fetchRecipes();
    let recipes = [];

    try {
        recipes = await fetchRecipes();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        errorMessage.textContent = 'Failed to load recipes.';
        return;
    }

    let filteredRecipes = recipes;

    const updateRecipeCards = (recipesToDisplay) => {
        if (!recipesToDisplay || recipesToDisplay.length === 0) {
            errorMessage.textContent = 'No recipes found.';
            return;
        }
        recipeCardsContainer.innerHTML = recipesToDisplay.map(createRecipeCard).join('');
        nbCard.textContent = `${recipesToDisplay.length} Recettes`;
    };
    
   
    populateFilters(recipes);
    updateRecipeCards();

    
    
    // Event listeners for search
   
        
       /* addTag(e.target.value);*/
    });
    document.getElementById('searchButton').addEventListener('click', () => {
        let query = document.getElementById('main-search').value;
        searchRecipes(query);
    
     // Event listeners for search
    document.getElementById('main-search').addEventListener('input', (e) => {
        filteredRecipes = filterByMainSearch(e.target.value, recipes);
        updateRecipeCards();
        
     
    });
    

    document.getElementById('filterButton').addEventListener('click', () => {
        let filters = getSelectedFilters();
        applyFilters(filters);
    });
    
   

    document.getElementById('main-search').addEventListener('input', (e) => {
        filteredRecipes = filterByMainSearch(e.target.value, recipes);
        updateRecipeCards(filteredRecipes);
    });
    
    document.getElementById('dropdownMenuButton1').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ingredient', recipes);
        console.log('Filtered Recipes after ingredient filter:', filteredRecipes);
        updateRecipeCards(filteredRecipes);
    });
    
    document.getElementById('dropdownMenuButton2').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ustensil', recipes);
        console.log('Filtered Recipes after ustensil filter:', filteredRecipes);
        updateRecipeCards(filteredRecipes);
    });
    
    document.getElementById('dropdownMenuButton3').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'appliance', recipes);
        console.log('Filtered Recipes after appliance filter:', filteredRecipes);
        updateRecipeCards(filteredRecipes);
    });
    
});


