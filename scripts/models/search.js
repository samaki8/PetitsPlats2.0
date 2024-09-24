// models/search.js
import { createRecipeCard } from '../models/RecipeCard.js';

export const filterByMainSearch = (searchTerm, recipes) => {
    if (searchTerm.length < 3) {
        return recipes; // Ne pas filtrer si le terme de recherche est inférieur à 3 caractères
    }

    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
            ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Assurez-vous que l'élément existe avant d'accéder à ses propriétés
    const recipeCardsContainer = document.getElementById('recipe-cards');
    if (recipeCardsContainer) {
        recipeCardsContainer.innerHTML = filteredRecipes.map(createRecipeCard).join('');
    }

    const nbCard = document.querySelector('.nbcard');
    if (nbCard) {
        nbCard.textContent = `${filteredRecipes.length} Recettes`;
    }

    return filteredRecipes;
};



/*export const filterByMainSearch = (query, recipes, updateRecipeCards, errorMessage) => {
    console.log(`Main search with query: ${query}`);
    let filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(query))
    );
    if (filteredRecipes.length === 0) {
        errorMessage.textContent = `Aucune recette trouvée pour "${query}"`;
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
    updateRecipeCards(filteredRecipes);
};

export const filterRecipes = (searchTerm, type, recipes, updateRecipeCards) => {
    console.log(`Filtering by ${type} with term: ${searchTerm}`);
    let filteredRecipes = recipes;
    if (searchTerm.length >= 3) {
        filteredRecipes = recipes.filter(recipe => {
            if (type === 'ingredient') {
                return recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchTerm.toLowerCase()));
            } else if (type === 'appliance') {
                return recipe.appliance.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (type === 'utensil') {
                return recipe.ustensils.some(ust => ust.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            return false;
        });
    }
    updateRecipeCards(filteredRecipes);
};*/
