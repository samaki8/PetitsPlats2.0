// RecipeCard.js
export function createRecipeCard(recipe) {
    return `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <img src="./data/JSON recipes/${recipe.image}" class="card-img-top" alt="${recipe.name}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.name}</h5>
                    <p class="card-text">${recipe.description}</p>
                    <ul class="list-group list-group-flush">
                        ${recipe.ingredients.map(ingredient => `
                            <li class="list-group-item">${ingredient.ingredient}: ${ingredient.quantity || ''} ${ingredient.unit || ''}</li>
                        `).join('')}
                    </ul>
                    <p class="card-text"><small class="text-muted">Temps de préparation: ${recipe.time} minutes</small></p>
                </div>
            </div>
        </div>
    `;
}
