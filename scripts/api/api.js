//api.js
import { recipes } from '../../data/recipes.js';
import { RecipeFactory } from '../factories/RecipeFactory.js';
/*
export async function fetchRecipes() {
    const response = await fetch('../data/recipes.json');
    const data = await response.json();
    return data.map(recipe => RecipeFactory(recipe));
}*/
export function fetchRecipes() {
    return recipes.map(recipe => RecipeFactory(recipe));
}