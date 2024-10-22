// scripts\pages\index.js


import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters, applyFilters } from '../models/filtres.js';
import { searchRecipes, filterRecipes, filterByIngredient, filterByUstensil, filterByAppliance, clearAllSearchTags } from '../models/search.js';

document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const mainSearch = document.getElementById('main-search');
    const clearSearchButton = document.getElementById('clear-search');

    const updateRecipeCards = (recipesToDisplay) => {
        if (!recipesToDisplay || recipesToDisplay.length === 0) {
            errorMessage.textContent = `Aucune recette ne contient "${query}"` ;
            errorMessage.style.display = 'block';
            recipeCardsContainer.innerHTML = '';
            nbCard.textContent = '0 Recettes';
            return;
        }
        errorMessage.style.display = 'none';
        recipeCardsContainer.innerHTML = recipesToDisplay.map(createRecipeCard).join('');
        nbCard.textContent = `${recipesToDisplay.length} Recettes`;
    };

    let recipes = [];

    try {
        recipes = await fetchRecipes();
        console.log(recipes);
        
        if (recipes.length > 0) {
            updateRecipeCards(recipes);
            populateFilters(recipes);
        } else {
            errorMessage.textContent = `Aucune recette ne contient "${query}"` ;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        errorMessage.textContent = 'Échec du chargement des recettes.';
        errorMessage.style.display = 'block';
    }

    const performSearch = () => {
        const query = mainSearch.value;
        const searchResults = searchRecipes(query);
        if (searchResults && searchResults.length === 0) {
            // S'assurer que le message d'erreur est visible même si searchResults est un tableau vide
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = `Aucune recette ne contient "${query}"`;
            errorMessage.style.display = 'block';
        }
        if (!searchResults) return; // Protection contre undefined
        applyFilters(searchResults);
        toggleClearButton();
    };
    
    const clearSearch = () => {
        mainSearch.value = '';
        updateRecipeCards(recipes);
        clearAllSearchTags();
        toggleClearButton();
    };
    
    const toggleClearButton = () => {
        clearSearchButton.style.display = mainSearch.value.length > 0 ? 'block' : 'none';
    };
    

    mainSearch.addEventListener('input', performSearch);
    document.getElementById('searchButton').addEventListener('click', performSearch);
    clearSearchButton.addEventListener('click', clearSearch);

    const filterFunctions = [filterByIngredient, filterByUstensil, filterByAppliance];
    
    ['dropdownMenuButton1', 'dropdownMenuButton2', 'dropdownMenuButton3'].forEach((id, index) => {
        document.getElementById(id).addEventListener('input', (e) => {
            filterRecipes(filterFunctions[index](e.target.value));
        });
    });

    // Initial setup
    toggleClearButton();
});