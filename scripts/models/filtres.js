// scripts\models\filtres.js

import { recipes } from '../../data/recipes.js';
import { createRecipeCard } from '../models/RecipeCard.js';

export function populateFilters() {
    const ingredientsList = document.getElementById('ingredients-list');
    const appliancesList = document.getElementById('appareil-list');
    const utensilsList = document.getElementById('ustensiles-list');
    const tagsContainer = document.getElementById('tags-container');
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');

    // Définir les ensembles pour les ingrédients, appareils et ustensiles
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => utensils.add(ust));
    });

    function createListItem(text, tag) {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.textContent = text;
        li.addEventListener('click', () => {
            addTag(text, tag);
            filterRecipesByTag();
        });
        return li;
    }

    function addTag(text, tag) {
        // Vérifier si le tag existe déjà
        const existingTags = Array.from(tagsContainer.getElementsByClassName('badge')).map(badge => badge.firstChild.textContent.trim());
        if (existingTags.includes(text)) {
            return; // Évite les doublons
        }
    
        const badge = document.createElement('span');
        badge.className = 'badge d-flex justify-content-between align-items-center text-bg-warning rounded-2';
        badge.textContent = `${text}`;
        badge.style = "width: 188px; height: 53px;";
    
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close ms-2';
        closeBtn.innerHTML = '×';
        closeBtn.style = "font-size: 1.5rem; line-height: 1;";
        closeBtn.addEventListener('click', () => {
            badge.remove();
            filterRecipesByTag();
        });
    
        badge.appendChild(closeBtn);
        tagsContainer.appendChild(badge);
    
        // Appeler la fonction de filtrage après avoir ajouté le tag
        filterRecipesByTag();
    }
    
    function filterRecipesByTag() {
        const tags = Array.from(tagsContainer.getElementsByClassName('badge')).map(badge => badge.firstChild.textContent.trim());
        console.log('Tags:', tags);

        let filteredRecipes = recipes;

        // Filtrer les recettes qui correspondent à TOUS les tags
        filteredRecipes = filteredRecipes.filter(recipe =>
            tags.every(tag =>
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(tag.toLowerCase())) ||
                recipe.appliance.toLowerCase().includes(tag.toLowerCase()) ||
                recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(tag.toLowerCase()))
            )
        );

        console.log('Filtered Recipes:', filteredRecipes);
        recipeCardsContainer.innerHTML = filteredRecipes.map(createRecipeCard).join('');
        nbCard.textContent = `${filteredRecipes.length} Recettes`;
    }

    ingredients.forEach(ing => ingredientsList.appendChild(createListItem(ing, 'ingredient')));
    appliances.forEach(app => appliancesList.appendChild(createListItem(app, 'appliance')));
    utensils.forEach(ust => utensilsList.appendChild(createListItem(ust, 'utensil')));

    function filterList(input, list) {
        const filter = input.value.toLowerCase();
        const items = list.getElementsByTagName('li');
        Array.from(items).forEach(item => {
            if (item.textContent.toLowerCase().includes(filter)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    const ingredientInput = document.getElementById('ingredients-search');
    const applianceInput = document.getElementById('appareil-search');
    const utensilInput = document.getElementById('ustensiles-search');

    ingredientInput.addEventListener('input', () => filterList(ingredientInput, ingredientsList));
    applianceInput.addEventListener('input', () => filterList(applianceInput, appliancesList));
    utensilInput.addEventListener('input', () => filterList(utensilInput, utensilsList));
}

export function applyFilters(filters) {
    let filteredResults = recipes.filter(recipe => {
        // Appliquer les filtres aux résultats de la recherche principale
        return filters.every(filter => filter(recipe));
    });
    displayResults(filteredResults);
}
