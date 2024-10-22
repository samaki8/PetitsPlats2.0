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

    for (let i = 0; i < currentRecipes.length; i++) {
        const recipe = currentRecipes[i];
        for (let j = 0; j < recipe.ingredients.length; j++) {
            ingredients.add(recipe.ingredients[j].ingredient);
        }
        appliances.add(recipe.appliance);
        for (let k = 0; k < recipe.ustensils.length; k++) {
            utensils.add(recipe.ustensils[k]);
        }
    }

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
        currentRecipes = recipes.filter(recipe =>
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
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.textContent.toLowerCase().includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    }
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


/*import { recipes } from '/data/recipes.js';
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

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        for (let j = 0; j < recipe.ingredients.length; j++) {
            ingredients.add(recipe.ingredients[j].ingredient);
        }
        appliances.add(recipe.appliance);
        for (let k = 0; k < recipe.ustensils.length; k++) {
            utensils.add(recipe.ustensils[k]);

        }
    }

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
        const existingTags = Array.from(tagsContainer.getElementsByClassName('badge'));
        for (let i = 0; i < existingTags.length; i++) {
            if (existingTags[i].firstChild.textContent.trim() === text) {
                return;
            }
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

        filterRecipesByTag();
    }

    function filterRecipesByTag() {
        const tags = Array.from(tagsContainer.getElementsByClassName('badge')).map(badge => badge.firstChild.textContent.trim());
        console.log('Tags:', tags);

        let filteredRecipes = [];

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            let includeRecipe = true;

            for (let j = 0; j < tags.length; j++) {
                const tag = tags[j].toLowerCase();
                let tagFound = false;

                for (let k = 0; k < recipe.ingredients.length; k++) {
                    if (recipe.ingredients[k].ingredient.toLowerCase().includes(tag)) {
                        tagFound = true;
                        break;
                    }
                }

                if (!tagFound && !recipe.appliance.toLowerCase().includes(tag)) {
                    for (let l = 0; l < recipe.ustensils.length; l++) {
                        if (recipe.ustensils[l].toLowerCase().includes(tag)) {
                            tagFound = true;
                            break;
                        }
                    }
                }

                if (!tagFound) {
                    includeRecipe = false;
                    break;
                }
            }

            if (includeRecipe) {
                filteredRecipes.push(recipe);
            }
        }

        console.log('Filtered Recipes:', filteredRecipes);
        recipeCardsContainer.innerHTML = '';
        for (let i = 0; i < filteredRecipes.length; i++) {
            recipeCardsContainer.innerHTML += createRecipeCard(filteredRecipes[i]);
        }
        nbCard.textContent = `${filteredRecipes.length} Recettes`;
    }

    const lists = [
        { set: ingredients, element: ingredientsList, tag: 'ingredient' },
        { set: appliances, element: appliancesList, tag: 'appliance' },
        { set: utensils, element: utensilsList, tag: 'utensil' }
    ];

    for (let i = 0; i < lists.length; i++) {
        const { set, element, tag } = lists[i];
        for (let item of set) {
            element.appendChild(createListItem(item, tag));
        }
    }

    function filterList(input, list) {
        const filter = input.value.toLowerCase();
        const items = list.getElementsByTagName('li');
        for (let i = 0; i < items.length; i++) {
            if (items[i].textContent.toLowerCase().includes(filter)) {
                items[i].style.display = '';
            } else {
                items[i].style.display = 'none';
            }
        }
    }

    const ingredientInput = document.getElementById('ingredients-search');
    const applianceInput = document.getElementById('appareil-search');
    const utensilInput = document.getElementById('ustensiles-search');

    ingredientInput.addEventListener('input', () => filterList(ingredientInput, ingredientsList));
    applianceInput.addEventListener('input', () => filterList(applianceInput, appliancesList));
    utensilInput.addEventListener('input', () => filterList(utensilInput, utensilsList));
}

export function applyFilters(filters) {
    let filteredResults = [];
    for (let i = 0; i < recipes.length; i++) {
        let includeRecipe = true;
        for (let j = 0; j < filters.length; j++) {
            if (!filters[j](recipes[i])) {
                includeRecipe = false;
                break;
            }
        }
        if (includeRecipe) {
            filteredResults.push(recipes[i]);
        }
    }
    displayResults(filteredResults);
}




*/




/*
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
        const existingTags = Array.from(tagsContainer.getElementsByClassName('badge')).map(badge => badge.firstChild.textContent.trim());
        if (existingTags.includes(text)) {
            return;
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

        filterRecipesByTag();
    }

    function filterRecipesByTag() {
        const tags = Array.from(tagsContainer.getElementsByClassName('badge')).map(badge => badge.firstChild.textContent.trim());
        console.log('Tags:', tags);

        let filteredRecipes = recipes;

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

    const lists = [
        { set: ingredients, element: ingredientsList, tag: 'ingredient' },
        { set: appliances, element: appliancesList, tag: 'appliance' },
        { set: utensils, element: utensilsList, tag: 'utensil' }
    ];

    lists.forEach(({ set, element, tag }) => {
        set.forEach(item => {
            element.appendChild(createListItem(item, tag));
        });
    });

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
        return filters.every(filter => filter(recipe));
    });
    displayResults(filteredResults);
}
*/