// scripts\models\filtres.js

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