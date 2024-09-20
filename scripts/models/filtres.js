import { recipes } from '/data/recipes.js';
export function populateFilters() {
    const ingredientsList = document.getElementById('ingredients-list');
    const appliancesList = document.getElementById('appliances-list');
    const utensilsList = document.getElementById('utensils-list');

    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => utensils.add(ust));
    });

    ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.textContent = ing;
        ingredientsList.appendChild(li);
    });

    appliances.forEach(app => {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.textContent = app;
        appliancesList.appendChild(li);
    });

    utensils.forEach(ust => {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.textContent = ust;
        utensilsList.appendChild(li);
    });
}

