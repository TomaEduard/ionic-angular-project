import { RecipesService } from './../recipes.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Recipe } from 'src/app/models/recipe.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit, OnDestroy{

  loadedRecipe: Recipe;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }


  ngOnInit() {
    console.log('ngOnInit', )
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {

      console.log('recipeId', params.has('recipeId'));

      if (!params.has('recipeId')) {
        // redirect
        this.router.navigate(['/recipes']);
        return;
      }

      const recipeId = params.get('recipeId');
      this.loadedRecipe = this.recipesService.getRecipe(recipeId)
    });
  }

  onDeleteRecipe() {
    this.alertCtrl.create({
      header: 'Are you sure?', 
      message: 'Do you really want to delete the recipe?',
      buttons: [
        {
          text: 'Cancel',
          role: 'canmcel'
        }, {
          text: 'Delete',
          handler: () => {
            this.recipesService.deleteRecipe(this.loadedRecipe.id);
            this.router.navigate(['/recipes']);
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    })
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }
  
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }
  
  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

}
