// scripts\pages\index.js

import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters, applyFilters } from '../models/filtres.js';
import { filterByMainSearch, addSearchTag, clearAllSearchTags } from '../models/search.js';

document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const mainSearch = document.getElementById('main-search');
    const clearSearchButton = document.getElementById('clear-search');

    const updateRecipeCards = (recipesToDisplay) => {
        if (!recipesToDisplay || recipesToDisplay.length === 0) {
            errorMessage.textContent = 'Aucune recette trouvée.';
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
    let filteredRecipes = [];

    try {
        recipes = await fetchRecipes();
        console.log(recipes);
        
        if (recipes.length > 0) {
            filteredRecipes = recipes;
            updateRecipeCards(recipes);
            populateFilters(recipes);
        } else {
            errorMessage.textContent = 'Aucune recette trouvée.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        errorMessage.textContent = 'Échec du chargement des recettes.';
        errorMessage.style.display = 'block';
    }

    const performSearch = () => {
        const query = mainSearch.value;
        filteredRecipes = filterByMainSearch(query, recipes);
        updateRecipeCards(filteredRecipes);
        toggleClearButton();
    };

    const clearSearch = () => {
        mainSearch.value = '';
        filteredRecipes = recipes;
        updateRecipeCards(filteredRecipes);
        clearAllSearchTags();  // Utilise la fonction exportée de search.js
        toggleClearButton();
    };

    const toggleClearButton = () => {
        if (mainSearch.value.length > 0) {
            clearSearchButton.style.display = 'block';
        } else {
            clearSearchButton.style.display = 'none';
        }
    };

    mainSearch.addEventListener('input', performSearch);
    document.getElementById('searchButton').addEventListener('click', performSearch);
    clearSearchButton.addEventListener('click', clearSearch);

    mainSearch.addEventListener('blur', () => {
        if (mainSearch.value.length >= 3) {
            addSearchTag(mainSearch.value);
        }
    });
    
    ['dropdownMenuButton1', 'dropdownMenuButton2', 'dropdownMenuButton3'].forEach((id, index) => {
        document.getElementById(id).addEventListener('input', (e) => {
            const filterTypes = ['ingredient', 'ustensil', 'appliance'];
            filteredRecipes = filterRecipes(e.target.value, filterTypes[index], recipes);
            console.log(`Recettes filtrées après le filtre ${filterTypes[index]} :`, filteredRecipes);
            updateRecipeCards(filteredRecipes);
        });
    });

    // Initial setup
    toggleClearButton();
});


/*
import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters, applyFilters } from '../models/filtres.js';
import { filterByMainSearch, addSearchTag } from '../models/search.js';

document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const mainSearch = document.getElementById('main-search');

    const updateRecipeCards = (recipesToDisplay) => {
        if (!recipesToDisplay || recipesToDisplay.length === 0) {
            errorMessage.textContent = 'Aucune recette trouvée.';
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
    let filteredRecipes = [];

    try {
        recipes = await fetchRecipes();
        console.log(recipes);
        
        if (recipes.length > 0) {
            filteredRecipes = recipes;
            updateRecipeCards(recipes);
            populateFilters(recipes);
        } else {
            errorMessage.textContent = 'Aucune recette trouvée.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        errorMessage.textContent = 'Échec du chargement des recettes.';
        errorMessage.style.display = 'block';
    }

    const performSearch = () => {
        const query = mainSearch.value;
        filteredRecipes = filterByMainSearch(query, recipes);
        updateRecipeCards(filteredRecipes);
    };

    mainSearch.addEventListener('input', performSearch);
    document.getElementById('searchButton').addEventListener('click', performSearch);

    mainSearch.addEventListener('blur', () => {
        if (mainSearch.value.length >= 3) {
            addSearchTag(mainSearch.value);
        }
    });
    
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        filterByMainSearch(searchTerm);
    });

    searchInput.addEventListener('blur', (event) => {
        const searchTerm = event.target.value;
        if (searchTerm.length >= 3) {
            addSearchTag(searchTerm);
        }
    });
    }
    ['dropdownMenuButton1', 'dropdownMenuButton2', 'dropdownMenuButton3'].forEach((id, index) => {
        document.getElementById(id).addEventListener('input', (e) => {
            const filterTypes = ['ingredient', 'ustensil', 'appliance'];
            filteredRecipes = filterRecipes(e.target.value, filterTypes[index], recipes);
            console.log(`Recettes filtrées après le filtre ${filterTypes[index]} :`, filteredRecipes);
            updateRecipeCards(filteredRecipes);
        });
    });
});

*/