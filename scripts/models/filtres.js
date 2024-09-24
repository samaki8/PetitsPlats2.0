// scripts\models\filtres.js

import { recipes } from '/data/recipes.js';
import { createRecipeCard } from '../models/RecipeCard.js';

export function populateFilters() {
    const ingredientsList = document.getElementById('ingredients-list');
    const appliancesList = document.getElementById('appareil-list');
    const utensilsList = document.getElementById('ustensiles-list');
    const tagsContainer = document.getElementById('tags-container');
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');

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
        const badge = document.createElement('span');
        badge.className = 'badge d-flex justify-content-between align-items-center text-bg-warning rounded-2';
        badge.textContent = `${text}`;
        badge.style="width: 188px; height: 53px;"
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close ms-2';
        closeBtn.addEventListener('click', () => {
            badge.remove();
            filterRecipesByTag();
        });
        badge.appendChild(closeBtn);
        tagsContainer.appendChild(badge);
    }

    function filterRecipesByTag() {
        const tags = Array.from(tagsContainer.getElementsByClassName('badge')).map(badge => {
            const [text, tag] = badge.textContent.split(' (');
            return { text: text.trim(), tag: tag.replace(')', '').trim() };
        });

        let filteredRecipes = recipes;

        tags.forEach(({ text, tag }) => {
            if (tag === 'ingredient') {
                filteredRecipes = filteredRecipes.filter(recipe =>
                    recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(text.toLowerCase()))
                );
            } else if (tag === 'appliance') {
                filteredRecipes = filteredRecipes.filter(recipe =>
                    recipe.appliance.toLowerCase().includes(text.toLowerCase())
                );
            } else if (tag === 'utensil') {
                filteredRecipes = filteredRecipes.filter(recipe =>
                    recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(text.toLowerCase()))
                );
            }
        });

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

/*
import { recipes } from '/data/recipes.js';
import { createRecipeCard } from '../models/RecipeCard.js';import { createRecipeCard } from '../models/RecipeCard.js';
export function populateFilters() {
    const ingredientsList = document.getElementById('ingredients-list');
    const appliancesList = document.getElementById('appareil-list');
    const utensilsList = document.getElementById('ustensiles-list');
    const tagsContainer = document.getElementById('tags-container');

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
        });
        return li;
    }

    function addTag(text, tag) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary text-white m-1';
        badge.textContent = `${text} (${tag})`;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close ms-2';
        closeBtn.addEventListener('click', () => {
            badge.remove();
            // Optionnel : mettre à jour les recettes filtrées ici
        });
        badge.appendChild(closeBtn);
        tagsContainer.appendChild(badge);
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
    */

/*
import { recipes } from '/data/recipes.js';

export function populateFilters() {
    const ingredientsList = document.getElementById('ingredients-list');
    const appliancesList = document.getElementById('appareil-list');
    const utensilsList = document.getElementById('ustensiles-list');
    const tagsContainer = document.getElementById('tags-container');

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
        });
        return li;
    }

    function addTag(text, tag) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-warning text-white m-1';
        badge.textContent = `${text} (${tag})`;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close ms-2';
        closeBtn.addEventListener('click', () => {
            badge.remove();
            // Optionnel : mettre à jour les recettes filtrées ici
        });
        badge.appendChild(closeBtn);
        tagsContainer.appendChild(badge);
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
*/