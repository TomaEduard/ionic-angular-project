import { RecipesService } from './recipes.service';
import { Component, OnInit } from '@angular/core';

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
}

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {

  recipes: Recipe[];

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipes = this.recipesService.getAllRecipes();
  }

  onToggleColorTheme(event) {
    console.log(event.detail.checked)
    document.body.setAttribute('color-theme', event.detail.checked ? 'dark' : 'light');
  }

}
