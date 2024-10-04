// index.js

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
    /*
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
*/


