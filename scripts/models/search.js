// models/search.js

import { createRecipeCard } from '../models/RecipeCard.js';
import { recipes } from '../../data/recipes.js';

let searchResults = recipes;


export function performSearch(query, recipesToSearch = recipes) {
    if (query.length < 3) {
        return recipesToSearch;
    }

    // Split la recherche en mots
    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    return recipesToSearch.filter(recipe => {
        return searchTerms.every(term => {
            const wordBoundaryQuery = new RegExp(`\\b${term}\\b`, 'i');
            
            const nameMatch = wordBoundaryQuery.test(recipe.name.toLowerCase());
            const descriptionMatch = wordBoundaryQuery.test(recipe.description.toLowerCase());
            const ingredientMatch = recipe.ingredients.some(ingredient => 
                wordBoundaryQuery.test(ingredient.ingredient.toLowerCase())
            );

            return nameMatch || descriptionMatch || ingredientMatch;
        });
    });
}
export function clearAllSearchTags() {
    const tagsContainer = document.getElementById('tags-container');
    if (tagsContainer) {
        const badges = tagsContainer.querySelectorAll('.badge');
        badges.forEach(badge => badge.remove());
    }
}
/*
export function displayResults(results) {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    if (recipeCardsContainer) {
        recipeCardsContainer.innerHTML = results.map(result => createRecipeCard(result)).join('');
    }

    const nbCard = document.querySelector('.nbcard');
    if (nbCard) {
        nbCard.textContent = `${results.length} Recettes`;
    }
}


export function searchRecipes(query) {
    searchResults = performSearch(query);
    displayResults(searchResults);
    return searchResults; // Ajoutez cette ligne pour retourner les résultats
}
*/
export function displayResults(results, showError = false) {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const errorMessage = document.getElementById('error-message');
    const nbCard = document.querySelector('.nbcard');
    const mainSearch = document.getElementById('main-search');
    const query = mainSearch.value.trim();

    if (!results || results.length === 0) {
        if (showError && query.length >= 3) {
            errorMessage.textContent = `Aucune recette ne contient "${query}"`;
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }
        recipeCardsContainer.innerHTML = '';
        nbCard.textContent = '0 Recettes';
        return;
    }

    errorMessage.style.display = 'none';
    recipeCardsContainer.innerHTML = results.map(result => createRecipeCard(result)).join('');
    nbCard.textContent = `${results.length} Recettes`;
}

export function searchRecipes(query, showError = false) {
    searchResults = performSearch(query);
    displayResults(searchResults, showError);
    return searchResults;
}

export function filterRecipes(filterFunction) {
    if (!searchResults) searchResults = [];
    searchResults = filterFunction(searchResults);
    displayResults(searchResults);
    return searchResults;
}
// Exemple de fonction de filtre (à adapter selon vos besoins)
export function filterByIngredient(ingredient) {
    return (recipes) => recipes.filter(recipe => 
        recipe.ingredients.some(ing => 
            ing.ingredient.toLowerCase().includes(ingredient.toLowerCase())
        )
    );
}
export function filterByUstensil(ustensil) {
    return (recipes) => recipes.filter(recipe => 
        recipe.ustensils.some(ing => 
            ing.ustensil.toLowerCase().includes(ustensil.toLowerCase())
        )
    );
}
export function filterByAppliance(appliance) {
    return (recipes) => recipes.filter(recipe => 
        recipe.appliances.some(ing => 
            ing.appliance.toLowerCase().includes(appliance.toLowerCase())
        )
    );
}