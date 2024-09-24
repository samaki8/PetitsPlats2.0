// index.js

import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters } from '../models/filtres.js';
import { filterByMainSearch } from '../models/search.js';

document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const tagsContainer = document.getElementById('tags-container');
    const recipes = await fetchRecipes();
    let filteredRecipes = recipes;

    const updateRecipeCards = () => {
        recipeCardsContainer.innerHTML = filteredRecipes.map(createRecipeCard).join('');
        nbCard.textContent = `${filteredRecipes.length} Recettes`;
    };

    updateRecipeCards();
    populateFilters(recipes);

    function addTag(text, type) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary text-white m-1';
        badge.textContent = `${text} (${type})`;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close ms-2';
        closeBtn.addEventListener('click', () => {
            badge.remove();
            // Optionnel : mettre à jour les recettes filtrées ici
        });
        badge.appendChild(closeBtn);
        tagsContainer.appendChild(badge);
    }

    // Event listeners for search
    document.getElementById('main-search').addEventListener('input', (e) => {
        filteredRecipes = filterByMainSearch(e.target.value, recipes);
        updateRecipeCards();
    });

    document.getElementById('dropdownMenuButton1').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ingredient', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'ingredient');
    });

    document.getElementById('dropdownMenuButton2').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ustensil', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'ustensil');
    });

    document.getElementById('dropdownMenuButton3').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'appliance', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'appliance');
    });
});

/*
import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters } from '../models/filtres.js';
import { filterByMainSearch } from '../models/search.js';

document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const tagsContainer = document.getElementById('tags-container');
    const recipes = await fetchRecipes();
    let filteredRecipes = recipes;

    const updateRecipeCards = () => {
        recipeCardsContainer.innerHTML = filteredRecipes.map(createRecipeCard).join('');
        nbCard.textContent = `${filteredRecipes.length} Recettes`;
    };

    updateRecipeCards();
    populateFilters(recipes);

    function addTag(text, type) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary text-white m-1';
        badge.textContent = `${text} (${type})`;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close ms-2';
        closeBtn.addEventListener('click', () => {
            badge.remove();
            // Optionnel : mettre à jour les recettes filtrées ici
        });
        badge.appendChild(closeBtn);
        tagsContainer.appendChild(badge);
    }

    // Event listeners for search
    document.getElementById('main-search').addEventListener('input', (e) => {
        filteredRecipes = filterByMainSearch(e.target.value, recipes);
        updateRecipeCards();
    });

    document.getElementById('dropdownMenuButton1').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ingredient', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'ingredient');
    });

    document.getElementById('dropdownMenuButton2').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ustensil', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'ustensil');
    });

    document.getElementById('dropdownMenuButton3').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'appliance', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'appliance');
    });
});

/*
import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters } from '../models/filtres.js';
document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const recipes = await fetchRecipes();
    let filteredRecipes = recipes;

    const updateRecipeCards = () => {
        recipeCardsContainer.innerHTML = filteredRecipes.map(createRecipeCard).join('');
        nbCard.textContent = `${filteredRecipes.length} Recettes`;
    };

    const filterRecipes = (searchTerm, type) => {
        console.log(`Filtering by ${type} with term: ${searchTerm}`);
        if (searchTerm.length < 3) {
            filteredRecipes = recipes;
        } else {
            filteredRecipes = filteredRecipes.filter(recipe => {
                if (type === 'ingredient') {
                    return recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchTerm.toLowerCase()));
                } else if (type === 'appliance') {
                    return recipe.appliance.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (type === 'utensil') {
                    return recipe.ustensils.some(ust => ust.toLowerCase().includes(searchTerm.toLowerCase()));
                }
                return false;
            });

            updateRecipeCards();
            populateFilters(recipes);
            updateFilters(filteredRecipes);
        };

        const filterByMainSearch = (query) => {
            console.log(`Main search with query: ${query}`);
            filteredRecipes = recipes.filter(recipe =>
                recipe.name.toLowerCase().includes(query) ||
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(query))
            );
            if (filteredRecipes.length === 0) {
                errorMessage.textContent = `Aucune recette trouvée pour "${query}"`;
                errorMessage.style.display = 'block';
            } else {
                errorMessage.style.display = 'none';
            }
            updateRecipeCards();
            updateFilters(filteredRecipes);
        };

        const updateFilters = (filteredRecipes) => {
            const ingredientsList = document.getElementById('ingredients-list');
            const appliancesList = document.getElementById('appareil-list');
            const utensilsList = document.getElementById('ustensiles-list');

            const ingredients = new Set();
            const appliances = new Set();
            const utensils = new Set();

            filteredRecipes.forEach(recipe => {
                recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
                appliances.add(recipe.appareil);
                recipe.ustensils.forEach(ust => utensils.add(ust));
            });

            ingredientsList.innerHTML = '';
            appliancesList.innerHTML = '';
            utensilsList.innerHTML = '';

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
        };

        const mainSearchInput = document.getElementById('inputGroup-sizing-lg');
        if (mainSearchInput) {
            mainSearchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                filterByMainSearch(query);
            });
        }

        const ingredientSearchInput = document.getElementById('ingredients-search');
        if (ingredientSearchInput) {
            ingredientSearchInput.addEventListener('input', (e) => {
                filterRecipes(e.target.value, 'ingredient');
            });
        }

        const applianceSearchInput = document.getElementById('appareil-search');
        if (applianceSearchInput) {
            applianceSearchInput.addEventListener('input', (e) => {
                filterRecipes(e.target.value, 'appliance');
            });
        }

        const utensilSearchInput = document.getElementById('ustensiles-search');
        if (utensilSearchInput) {
            utensilSearchInput.addEventListener('input', (e) => {
                filterRecipes(e.target.value, 'utensil');
            });
        }

        // Afficher toutes les cartes de recettes au lancement du site
        updateRecipeCards();
        // Afficher les listes d'ingrédients, d'ustensiles et d'appareils avant tout filtrage
        updateFilters(recipes);
    }
*/
// scripts/index.js


/*
import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters } from '../models/filtres.js';
import { filterByMainSearch,} from '../models/search.js';

document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const tagsContainer = document.getElementById('tags-container');
    const recipes = await fetchRecipes();
    let filteredRecipes = recipes;
    const updateRecipeCards = () => {
        filteredRecipes = filterByMainSearch(document.getElementById('main-search').value, recipes);
    };

    document.getElementById('main-search').addEventListener('input', (e) => {
        updateRecipeCards();
    });

    // Initial call to populate the cards
    updateRecipeCards();
   /*
    const updateRecipeCards = () => {
        recipeCardsContainer.innerHTML = filteredRecipes.map(createRecipeCard).join('');
        nbCard.textContent = `${filteredRecipes.length} Recettes`;
        
    };

    updateRecipeCards();
    populateFilters(recipes);
    */
/*
    function addTag(text, type) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary text-white m-1';
        badge.textContent = `${text} (${type})`;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close ms-2';
        closeBtn.addEventListener('click', () => {
            badge.remove();
            // Optionnel : mettre à jour les recettes filtrées ici
        });
        badge.appendChild(closeBtn);
        tagsContainer.appendChild(badge);
    }

    // Event listeners for search
    document.getElementById('main-search').addEventListener('input', (e) => {
        filteredRecipes = filterByMainSearch(e.target.value, recipes);
        updateRecipeCards();
        addTag(e.target.value);
    
    });

    document.getElementById('dropdownMenuButton1').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ingredient', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'ingredient');
    });

    document.getElementById('dropdownMenuButton2').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'ustensil', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'ustensil');
    });

    document.getElementById('dropdownMenuButton3').addEventListener('input', (e) => {
        filteredRecipes = filterRecipes(e.target.value, 'appliance', recipes);
        updateRecipeCards();
        addTag(e.target.value, 'appliance');
    });
});
*/


