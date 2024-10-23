// scripts\pages\index.js
import { fetchRecipes } from '../api/api.js';
import { createRecipeCard } from '../models/RecipeCard.js';
import { populateFilters, applyFilters } from '../models/filtres.js';
import { 
    searchRecipes, 
    filterRecipes, 
    filterByIngredient, 
    filterByUstensil, 
    filterByAppliance, 
    clearAllSearchTags 
} from '../models/search.js';

// Fonctions utilitaires déplacées hors du DOMContentLoaded
const createUpdateRecipeCards = (recipeCardsContainer, nbCard, errorMessage) => 
    (recipesToDisplay, query = '', shouldShowError = false) => {
        if (!recipesToDisplay?.length) {
            if (shouldShowError && query.length >= 3) {
                errorMessage.textContent = `Aucune recette ne contient "${query}"`;
                errorMessage.style.display = 'block';
            }
            recipeCardsContainer.innerHTML = '';
            nbCard.textContent = '0 Recettes';
            return;
        }

        errorMessage.style.display = 'none';
        recipeCardsContainer.innerHTML = recipesToDisplay.map(createRecipeCard).join('');
        nbCard.textContent = `${recipesToDisplay.length} Recettes`;
    };

const setupSearchHandlers = (
    mainSearch, 
    recipes, 
    updateRecipeCards, 
    errorMessage, 
    clearSearchButton
) => {
    let searchTimeout;

    const toggleClearButton = () => {
        clearSearchButton.style.display = mainSearch.value.length > 0 ? 'block' : 'none';
    };

    const performSearch = () => {
        const query = mainSearch.value.trim();
        /*
        if (query.length > 0 && query.length < 3) {
            errorMessage.textContent = 'Veuillez saisir au moins 3 caractères pour la recherche';
            errorMessage.style.display = 'block';
            return;
        }
        */
        if (query.length > 0 && query.length < 3) {
            return;
        }
        if (query.length === 0) {
            errorMessage.style.display = 'none';
            updateRecipeCards(recipes);
        }
        
        toggleClearButton();
    };

    const executeSearch = () => {
        const query = mainSearch.value.trim();
        
        if (query.length === 0) {
            updateRecipeCards(recipes);
            errorMessage.style.display = 'none';
            return;
        }
        /*
        if (query.length < 3) {
            errorMessage.textContent = 'Veuillez saisir au moins 3 caractères pour la recherche';
            errorMessage.style.display = 'block';
            updateRecipeCards(recipes);
            return;
        }
        */
        if (query.length < 3) {
            updateRecipeCards(recipes);
            return;
        }
        const searchResults = searchRecipes(query);
        if (!searchResults) return;
        
        updateRecipeCards(searchResults, query, true);
        applyFilters(searchResults);
        toggleClearButton();
    };

    const clearSearch = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        mainSearch.value = '';
        updateRecipeCards(recipes);
        clearAllSearchTags();
        toggleClearButton();
        errorMessage.style.display = 'none';
    };

    // Gestionnaires d'événements
    /*mainSearch.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        performSearch();
        
        if (mainSearch.value.trim().length >= 3) {
            searchTimeout = setTimeout(executeSearch, 300);
        }
    });
     */
    mainSearch.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        
        // On ne veut plus exécuter la recherche immédiatement avec performSearch()
        // On veut juste gérer le bouton clear
        toggleClearButton();
        
        if (mainSearch.value.trim().length >= 3) {
            // On cache le message d'erreur pendant la saisie
            errorMessage.style.display = 'none';
            // On attend la fin de la saisie avant d'exécuter la recherche
            searchTimeout = setTimeout(executeSearch, 500);
        } else {
            // Si moins de 3 caractères, on réinitialise l'affichage
            updateRecipeCards(recipes);
            errorMessage.style.display = 'none';
        }
    });
    mainSearch.addEventListener('blur', executeSearch);
    document.getElementById('searchButton').addEventListener('click', executeSearch);
    clearSearchButton.addEventListener('click', clearSearch);

    return { executeSearch, clearSearch, toggleClearButton };
};

// Event principal
document.addEventListener('DOMContentLoaded', async () => {
    const recipeCardsContainer = document.getElementById('recipe-cards');
    const nbCard = document.querySelector('.nbcard');
    const errorMessage = document.getElementById('error-message');
    const mainSearch = document.getElementById('main-search');
    const clearSearchButton = document.getElementById('clear-search');

    const updateRecipeCards = createUpdateRecipeCards(
        recipeCardsContainer, 
        nbCard, 
        errorMessage
    );

    let recipes = [];

    try {
        recipes = await fetchRecipes();
        console.log(recipes);
        
        if (recipes.length > 0) {
            updateRecipeCards(recipes);
            populateFilters(recipes);
        } else {
            errorMessage.textContent = 'Aucune recette disponible';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        errorMessage.textContent = 'Échec du chargement des recettes.';
        errorMessage.style.display = 'block';
        return;
    }

    const { toggleClearButton } = setupSearchHandlers(
        mainSearch,
        recipes,
        updateRecipeCards,
        errorMessage,
        clearSearchButton
    );

    // Configuration des filtres
    const filterFunctions = [filterByIngredient, filterByUstensil, filterByAppliance];
    
    ['dropdownMenuButton1', 'dropdownMenuButton2', 'dropdownMenuButton3'].forEach((id, index) => {
        document.getElementById(id).addEventListener('input', (e) => {
            filterRecipes(filterFunctions[index](e.target.value));
        });
    });

    toggleClearButton();
});

// Utilitaire pour générer des données de test
function generateTestData(size) {
    const testRecipes = [];
    for (let i = 0; i < size; i++) {
        testRecipes.push({
            name: `Recipe ${i}`,
            description: `Description for recipe ${i} with some random words like tomato, pasta, chicken`,
            ingredients: [
                { ingredient: 'Tomato', quantity: 2 },
                { ingredient: 'Pasta', quantity: 100 },
                { ingredient: 'Olive Oil', quantity: 2 }
            ],
            ustensils: ['pan', 'pot', 'knife'],
            appliance: 'oven'
        });
    }
    return testRecipes;
}

// Fonction pour mesurer le temps d'exécution
function measurePerformance(fn, name, iterations = 100) {
    const times = [];
    console.log(`\nTesting ${name}...`);

    // Warm-up (pour JIT compilation)
    for (let i = 0; i < 5; i++) {
        fn();
    }

    // Tests réels
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        fn();
        const end = performance.now();
        times.push(end - start);
    }

    // Calcul des statistiques
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const sorted = times.sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    console.log(`Results for ${name}:`);
    console.log(`  Average: ${average.toFixed(3)}ms`);
    console.log(`  Median: ${median.toFixed(3)}ms`);
    console.log(`  Min: ${min.toFixed(3)}ms`);
    console.log(`  Max: ${max.toFixed(3)}ms`);

    return { name, average, median, min, max, times };
}
/*
// Tests de performance pour la recherche
function testSearchPerformance() {
    console.log('=== Search Performance Tests ===');
    
    const testData = generateTestData(1000); // 1000 recettes
    const searchQuery = 'tomato pasta';

    // Version avec forEach/filter/some
    function searchWithFunctional(query, recipes) {
        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        return recipes.filter(recipe => {
            return searchTerms.every(term => {
                const wordBoundaryQuery = new RegExp(`\\b${term}\\b`, 'i');
                const nameMatch = wordBoundaryQuery.test(recipe.name.toLowerCase());
                const descriptionMatch = wordBoundaryQuery.test(recipe.description.toLowerCase());
                const ingredientMatch = recipe.ingredients.some(ingredient =>
                    wordBoundaryQuery.test(ingredient.ingredient.toLowerCase())
                );
                return nameMatch || descriptionMatch || ingredientMatch;
            });
        });
    }

    // Version avec boucles for
    function searchWithForLoops(query, recipes) {
        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        const results = [];
        
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            let allTermsMatch = true;

            for (let j = 0; j < searchTerms.length; j++) {
                const term = searchTerms[j];
                const wordBoundaryQuery = new RegExp(`\\b${term}\\b`, 'i');
                
                const nameMatch = wordBoundaryQuery.test(recipe.name.toLowerCase());
                const descriptionMatch = wordBoundaryQuery.test(recipe.description.toLowerCase());
                
                let ingredientMatch = false;
                for (let k = 0; k < recipe.ingredients.length; k++) {
                    if (wordBoundaryQuery.test(recipe.ingredients[k].ingredient.toLowerCase())) {
                        ingredientMatch = true;
                        break;
                    }
                }

                if (!(nameMatch || descriptionMatch || ingredientMatch)) {
                    allTermsMatch = false;
                    break;
                }
            }

            if (allTermsMatch) {
                results.push(recipe);
            }
        }
        
        return results;
    }

    // Exécution des tests
    const functionalResults = measurePerformance(
        () => searchWithFunctional(searchQuery, testData),
        'Functional Style Search'
    );

    const forLoopResults = measurePerformance(
        () => searchWithForLoops(searchQuery, testData),
        'For Loops Search'
    );

    // Comparaison des performances
    const improvement = ((functionalResults.average - forLoopResults.average) / functionalResults.average * 100).toFixed(2);
    console.log(`\nPerformance improvement with for loops: ${improvement}%`);
}

// Tests de performance pour l'affichage
function testDisplayPerformance() {
    console.log('\n=== Display Performance Tests ===');
    
    const testData = generateTestData(100);

    // Version avec map
    function displayWithMap(results) {
        const html = results.map(result => `
            <div class="recipe-card">
                <h3>${result.name}</h3>
                <p>${result.description}</p>
            </div>
        `).join('');
        return html;
    }

    // Version avec for
    function displayWithFor(results) {
        let html = '';
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            html += `
                <div class="recipe-card">
                    <h3>${result.name}</h3>
                    <p>${result.description}</p>
                </div>
            `;
        }
        return html;
    }

    measurePerformance(
        () => displayWithMap(testData),
        'Display with Map'
    );

    measurePerformance(
        () => displayWithFor(testData),
        'Display with For Loop'
    );
}

// Exécution des tests
testSearchPerformance();
testDisplayPerformance();*/