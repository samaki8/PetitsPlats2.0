//RecipeFactory.js
export function RecipeFactory(data) {
    return {
        id: data.id,
        image: data.image,
        name: data.name,
        servings: data.servings,
        ingredients: data.ingredients,
        time: data.time,
        description: data.description,
        appliance: data.appliance,
        ustensils: data.ustensils
    };
}