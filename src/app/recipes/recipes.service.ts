import { Injectable } from '@angular/core';
import { Recipe } from './recipes.page';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
        
  recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1024px-Schnitzel.JPG',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg/1024px-Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ]

  constructor() { }

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return {...this.recipes.find(e => e.id === recipeId)};
  }

  deleteRecipe(recipeId: string) {
    console.log('#1 this.recipes', this.recipes)
    this.recipes = this.recipes.filter(e => e.id !== recipeId);
    console.log('#2 this.recipes', this.recipes)
  }

}
