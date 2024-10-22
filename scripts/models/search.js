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
    const filteredRecipes = [];

    // Remplace filter et every par des boucles for
    for (let i = 0; i < recipesToSearch.length; i++) {
        const recipe = recipesToSearch[i];
        let allTermsMatch = true;

        for (let j = 0; j < searchTerms.length; j++) {
            const term = searchTerms[j];
            const wordBoundaryQuery = new RegExp(`\\b${term}\\b`, 'i');
            
            const nameMatch = wordBoundaryQuery.test(recipe.name.toLowerCase());
            const descriptionMatch = wordBoundaryQuery.test(recipe.description.toLowerCase());
            
            // Remplace some par une boucle for
            let ingredientMatch = false;
            for (let k = 0; k < recipe.ingredients.length; k++) {
                if (wordBoundaryQuery.test(recipe.ingredients[k].ingredient.toLowerCase())) {
                    ingredientMatch = true;
                    break;
                }
            }

            if (!(nameMatch || descriptionMatch || ingredientMatch)) {
                allTermsMatch = false;
                break;
            }
        }

        if (allTermsMatch) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
}

export function clearAllSearchTags() {
    const tagsContainer = document.getElementById('tags-container');
    if (tagsContainer) {
        const badges = tagsContainer.querySelectorAll('.badge');
        // Remplace forEach par une boucle for
        for (let i = 0; i < badges.length; i++) {
            badges[i].remove();
        }
    }
}

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
    
    // Remplace map par une boucle for
    let htmlContent = '';
    for (let i = 0; i < results.length; i++) {
        htmlContent += createRecipeCard(results[i]);
    }
    recipeCardsContainer.innerHTML = htmlContent;
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

export function filterByIngredient(ingredient) {
    return (recipes) => {
        const filteredRecipes = [];
        // Remplace filter et some par des boucles for
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            let found = false;
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(ingredient.toLowerCase())) {
                    found = true;
                    break;
                }
            }
            if (found) {
                filteredRecipes.push(recipe);
            }
        }
        return filteredRecipes;
    };
}

export function filterByUstensil(ustensil) {
    return (recipes) => {
        const filteredRecipes = [];
        // Remplace filter et some par des boucles for
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            let found = false;
            for (let j = 0; j < recipe.ustensils.length; j++) {
                if (recipe.ustensils[j].toLowerCase().includes(ustensil.toLowerCase())) {
                    found = true;
                    break;
                }
            }
            if (found) {
                filteredRecipes.push(recipe);
            }
        }
        return filteredRecipes;
    };
}

export function filterByAppliance(appliance) {
    return (recipes) => {
        const filteredRecipes = [];
        // Remplace filter et some par des boucles for
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            let found = false;
            for (let j = 0; j < recipe.appliances.length; j++) {
                if (recipe.appliances[j].toLowerCase().includes(appliance.toLowerCase())) {
                    found = true;
                    break;
                }
            }
            if (found) {
                filteredRecipes.push(recipe);
            }
        }
        return filteredRecipes;
    };
}



/*
import { createRecipeCard } from '../models/RecipeCard.js';
import { recipes } from '/data/recipes.js';

let searchResults = [];

export function performSearch(query, recipesToSearch = recipes) {
    if (query.length < 3) {
        return recipesToSearch;
    }

    const lowercaseQuery = query.toLowerCase();
    const filteredRecipes = [];

    for (let i = 0; i < recipesToSearch.length; i++) {
        const recipe = recipesToSearch[i];
        let isMatch = false;

        // Vérifier le nom et la description
        if (
            recipe.name.toLowerCase().includes(lowercaseQuery) ||
            recipe.description.toLowerCase().includes(lowercaseQuery)
        ) {
            isMatch = true;
        } else {
            // Vérifier les ingrédients
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(lowercaseQuery)) {
                    isMatch = true;
                    break;  // Sortir de la boucle des ingrédients si une correspondance est trouvée
                }
            }
        }

        // Si une correspondance a été trouvée, ajouter la recette au résultat
        if (isMatch) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
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