// scripts\pages\index.js

import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters, applyFilters } from '../models/filtres.js';
import { 
    searchRecipes, 
    filterRecipes, 
    filterByIngredient, 
    filterByUstensil, 
    filterByAppliance, 
    clearAllSearchTags 
} from '../models/search.js';

// Fonctions utilitaires déplacées hors du DOMContentLoaded
const createUpdateRecipeCards = (recipeCardsContainer, nbCard, errorMessage) => 
    (recipesToDisplay, query = '', shouldShowError = false) => {
        if (!recipesToDisplay?.length) {
            if (shouldShowError && query.length >= 3) {
                errorMessage.textContent = `Aucune recette ne contient "${query}"`;
                errorMessage.style.display = 'block';
            }
            recipeCardsContainer.innerHTML = '';
            nbCard.textContent = '0 Recettes';
            return;
        }

        errorMessage.style.display = 'none';
        recipeCardsContainer.innerHTML = recipesToDisplay.map(createRecipeCard).join('');
        nbCard.textContent = `${recipesToDisplay.length} Recettes`;
    };

const setupSearchHandlers = (
    mainSearch, 
    recipes, 
    updateRecipeCards, 
    errorMessage, 
    clearSearchButton
) => {
    let searchTimeout;

    const toggleClearButton = () => {
        clearSearchButton.style.display = mainSearch.value.length > 0 ? 'block' : 'none';
    };

    const performSearch = () => {
        const query = mainSearch.value.trim();
        
        if (query.length > 0 && query.length < 3) {
            errorMessage.textContent = 'Veuillez saisir au moins 3 caractères pour la recherche';
            errorMessage.style.display = 'block';
            return;
        }
        
        if (query.length === 0) {
            errorMessage.style.display = 'none';
            updateRecipeCards(recipes);
        }
        
        toggleClearButton();
    };

    const executeSearch = () => {
        const query = mainSearch.value.trim();
        
        if (query.length === 0) {
            updateRecipeCards(recipes);
            errorMessage.style.display = 'none';
            return;
        }
        /*
        if (query.length < 3) {
            errorMessage.textContent = 'Veuillez saisir au moins 3 caractères pour la recherche';
            errorMessage.style.display = 'block';
            updateRecipeCards(recipes);
            return;
        }
        */
        const searchResults = searchRecipes(query);
        if (!searchResults) return;
        
        updateRecipeCards(searchResults, query, true);
        applyFilters(searchResults);
        toggleClearButton();
    };

    const clearSearch = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        mainSearch.value = '';
        updateRecipeCards(recipes);
        clearAllSearchTags();
        toggleClearButton();
        errorMessage.style.display = 'none';
    };

    // Gestionnaires d'événements
    mainSearch.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        performSearch();
        
        if (mainSearch.value.trim().length >= 3) {
            searchTimeout = setTimeout(executeSearch, 300);
        }
    });

    mainSearch.addEventListener('blur', executeSearch);
    document.getElementById('searchButton').addEventListener('click', executeSearch);
    clearSearchButton.addEventListener('click', clearSearch);

    return { executeSearch, clearSearch, toggleClearButton };
};

// Event principal
document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const mainSearch = document.getElementById('main-search');
    const clearSearchButton = document.getElementById('clear-search');

    const updateRecipeCards = createUpdateRecipeCards(
        recipeCardsContainer, 
        nbCard, 
        errorMessage
    );

    let recipes = [];

    try {
        recipes = await fetchRecipes();
        console.log(recipes);
        
        if (recipes.length > 0) {
            updateRecipeCards(recipes);
            populateFilters(recipes);
        } else {
            errorMessage.textContent = 'Aucune recette disponible';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        errorMessage.textContent = 'Échec du chargement des recettes.';
        errorMessage.style.display = 'block';
        return;
    }

    const { toggleClearButton } = setupSearchHandlers(
        mainSearch,
        recipes,
        updateRecipeCards,
        errorMessage,
        clearSearchButton
    );

    // Configuration des filtres
    const filterFunctions = [filterByIngredient, filterByUstensil, filterByAppliance];
    
    ['dropdownMenuButton1', 'dropdownMenuButton2', 'dropdownMenuButton3'].forEach((id, index) => {
        document.getElementById(id).addEventListener('input', (e) => {
            filterRecipes(filterFunctions[index](e.target.value));
        });
    });

    toggleClearButton();
});
/*
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
/*
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
    };*/
    /*
    const executeSearch = () => {
        const query = mainSearch.value.trim();
        
        // Si la recherche est trop courte, afficher toutes les recettes
        if (query.length < 3) {
            updateRecipeCards(recipes);
            return;
        }
        
        const searchResults = searchRecipes(query);
        if (!searchResults) return;
        applyFilters(searchResults);
        toggleClearButton();
    };

    // La fonction performSearch ne fait maintenant que mettre à jour les suggestions
    const performSearch = () => {
        const query = mainSearch.value.trim();
        
        // Cacher le message d'erreur pendant la saisie
        errorMessage.style.display = 'none';
        
        if (query.length < 3) {
            updateRecipeCards(recipes);
            return;
        }
        
        // Mettre à jour les cartes sans afficher de message d'erreur
        const searchResults = searchRecipes(query);
        if (!searchResults) return;
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
    
    mainSearch.addEventListener('input', performSearch); // Pour la mise à jour en temps réel
    mainSearch.addEventListener('blur', executeSearch);  // Pour la recherche à la sortie du champ
    document.getElementById('searchButton').addEventListener('click', executeSearch); // Pour la recherche au clic
 
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
}); */