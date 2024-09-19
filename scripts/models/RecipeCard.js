// RecipeCard.js
// RecipeCard.js
export function createRecipeCard(recipe) {
    return `
        <div class="col">
            <div class="card h-100 shadow-sm" >
                <div class="position-relative">
                    <img src="./data/JSON recipes/${recipe.image}" class="card-img-top" alt="${recipe.name}">
                    <span class="badge bg-warning position-absolute top-0 end-0 m-2">${recipe.time} min</span>
                </div>
                <div class="card-body px-4">
                    <h5 class="card-title">${recipe.name}</h5>
                    <h6 class="card-tt mt-4 mb-2">RECETTE</h6>
                    <p class="card-text">${recipe.description}</p>
                    <h6 class="card-tt mt-5">INGRÉDIENTS</h6>
                    <div class="row">
                        ${recipe.ingredients.map(ingredient => `
                            <div class="col-6">
                                <li class="list-group-item">
                                    ${ingredient.ingredient}<br>
                                    <small>${ingredient.quantity || ''} ${ingredient.unit || ''}</small>
                                </li>
                            </div>
                        `).join('')}
                    </div>
                  <!--  <p class="card-text"><small class="text-muted">Temps de préparation: ${recipe.time} minutes</small></p> -->
                </div>
            </div>
        </div>
    `;
}

