// models/search.js

import { createRecipeCard } from '../models/RecipeCard.js';
import { recipes } from '../../data/recipes.js';

let searchResults = recipes;
/*
export function performSearch(query, recipesToSearch = recipes) {
    if (query.length < 3) {
        return recipesToSearch;
    }

    const lowercaseQuery = query.toLowerCase();

    return recipesToSearch.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(lowercaseQuery);
        const descriptionMatch = recipe.description.toLowerCase().includes(lowercaseQuery);
        const ingredientMatch = recipe.ingredients.some(ingredient => 
            ingredient.ingredient.toLowerCase().includes(lowercaseQuery)
        );

        return nameMatch || descriptionMatch || ingredientMatch;
    });
}
*/
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
/*import { createRecipeCard } from '../models/RecipeCard.js';
import { recipes } from '../../data/recipes.js';

let searchResults = [];


export function performSearch(query, recipesToSearch = recipes) {
    if (query.length < 3) {
        return recipesToSearch;
    }

    const lowercaseQuery = query.toLowerCase();

    return recipesToSearch.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(lowercaseQuery);
        const descriptionMatch = recipe.description.toLowerCase().includes(lowercaseQuery);
        const ingredientMatch = recipe.ingredients.some(ingredient => 
            ingredient.ingredient.toLowerCase().includes(lowercaseQuery)
        );

        return nameMatch || descriptionMatch || ingredientMatch;
    });
}


export function addSearchTag(searchTerm) {
    const tagsContainer = document.getElementById('tags-container');
    if (tagsContainer) {
        const existingTags = Array.from(tagsContainer.getElementsByClassName('badge'));
        if (existingTags.length > 0) {
            existingTags[0].firstChild.textContent = searchTerm;
        } else {
            const badge = document.createElement('span');
            badge.className = 'badge d-flex justify-content-between align-items-center text-bg-warning rounded-2';
            badge.textContent = searchTerm;
            badge.style = "width: 188px; height: 53px;";

            const closeBtn = document.createElement('button');
            closeBtn.className = 'btn-close ms-2';
            closeBtn.innerHTML = '×';
            closeBtn.style = "font-size: 1.5rem; line-height: 1;";
            closeBtn.addEventListener('click', () => {
                badge.remove();
            });

            badge.appendChild(closeBtn);
            tagsContainer.appendChild(badge);
        }
    }
}
export function clearAllSearchTags() {
    const tagsContainer = document.getElementById('tags-container');
    if (tagsContainer) {
        const badges = tagsContainer.querySelectorAll('.badge');
        badges.forEach(badge => badge.remove());
    }
}

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
}

export function filterByMainSearch(searchTerm, recipesToFilter = recipes) {
    const filteredRecipes = performSearch(searchTerm, recipesToFilter);
    displayResults(filteredRecipes);
    return filteredRecipes;
}

*/