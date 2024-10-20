// models/search.js

// models/search.js
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
