// scripts\models\filtres.js

import { recipes } from '../../data/recipes.js';
import { createRecipeCard } from '../models/RecipeCard.js';

let currentRecipes = recipes;
let appliedTags = new Set();

export function populateFilters(initialRecipes = recipes) {
    currentRecipes = initialRecipes;
    appliedTags.clear();
    updateFilterLists();
}

function updateFilterLists() {
    const ingredientsList = document.getElementById('ingredients-list');
    const appliancesList = document.getElementById('appareil-list');
    const utensilsList = document.getElementById('ustensiles-list');

    // Vider les listes existantes
    ingredientsList.innerHTML = '';
    appliancesList.innerHTML = '';
    utensilsList.innerHTML = '';

    // Définir les ensembles pour les ingrédients, appareils et ustensiles
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    currentRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => utensils.add(ust));
    });

    // Remplir les listes avec les nouveaux éléments
    ingredients.forEach(ing => ingredientsList.appendChild(createListItem(ing, 'ingredient')));
    appliances.forEach(app => appliancesList.appendChild(createListItem(app, 'appliance')));
    utensils.forEach(ust => utensilsList.appendChild(createListItem(ust, 'utensil')));
}

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
    if (appliedTags.has(text)) return; // Éviter les doublons

    appliedTags.add(text);

    const tagsContainer = document.getElementById('tags-container');
    const badge = document.createElement('span');
    badge.className = 'badge d-flex justify-content-between align-items-center text-bg-warning rounded-2';
    badge.textContent = text;
    badge.style = "width: 188px; height: 53px;";

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close ms-2';
    closeBtn.innerHTML = '×';
    closeBtn.style = "font-size: 1.5rem; line-height: 1;";
    closeBtn.addEventListener('click', () => {
        badge.remove();
        appliedTags.delete(text);
        filterRecipesByTags();
    });

    badge.appendChild(closeBtn);
    tagsContainer.appendChild(badge);

    filterRecipesByTags();
}

function filterRecipesByTags() {
    if (appliedTags.size === 0) {
        // Si aucun tag n'est appliqué, on revient à l'ensemble initial des recettes
        currentRecipes = recipes;
    } else {
        // Filtrer les recettes en fonction des tags appliqués
        currentRecipes = currentRecipes.filter(recipe =>
            Array.from(appliedTags).every(tag =>
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(tag.toLowerCase())) ||
                recipe.appliance.toLowerCase().includes(tag.toLowerCase()) ||
                recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(tag.toLowerCase()))
            )
        );
    }

    updateFilterLists();
    displayResults(currentRecipes);
}

function displayResults(results) {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    
    recipeCardsContainer.innerHTML = results.map(createRecipeCard).join('');
    nbCard.textContent = `${results.length} Recettes`;
}

// Fonctions pour filtrer les listes déroulantes
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

// Event listeners pour les champs de recherche des filtres
document.getElementById('ingredients-search').addEventListener('input', (e) => filterList(e.target, document.getElementById('ingredients-list')));
document.getElementById('appareil-search').addEventListener('input', (e) => filterList(e.target, document.getElementById('appareil-list')));
document.getElementById('ustensiles-search').addEventListener('input', (e) => filterList(e.target, document.getElementById('ustensiles-list')));

export function applyFilters(searchResults) {
    currentRecipes = searchResults;
    appliedTags.clear();
    updateFilterLists();
    displayResults(currentRecipes);
}

export function clearFilters() {
    appliedTags.clear();
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.innerHTML = '';
    currentRecipes = recipes;
    updateFilterLists();
    displayResults(currentRecipes);
}