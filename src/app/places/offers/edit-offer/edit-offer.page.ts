import { PlacesService } from './../../places.service';
import { PlacesRoutingModule } from './../../places-routing.module';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Place } from '../../place.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  form: FormGroup;
  place: Place;
  placeId: string;
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.placesSub = this.route.paramMap.subscribe((params: ParamMap) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/okaces/tabs/offers')
        return;
      }

      this.placeId = params.get('placeId');

      this.isLoading = true;

      this.placesService.getPlace(params.get('placeId'))
        .subscribe((place: Place) => {
          this.place = place;

          console.log('this.place', this.place);
    
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            }),
          });
          
          this.isLoading = false;

        }, error => {
          this.alertCtrl.create(
            {
              header: 'An error occurred!',
              message: 'Place could not be fetched. Please try again later.',
              buttons: [{text: 'Okay', handler: () => {
                this.router.navigate(['/places/tabs/offers'])
              }}]
            }).then(alertEl => {
              alertEl.present();
            })
        });
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onUpdateOffer() {
    if (this.form.invalid) {
      return;
    }

    // const newPlace = {...this.place};
    // newPlace.title = this.form.value.title;
    // newPlace.description = this.form.value.description;
    
    // this.place.title = this.form.value.title;
    // this.place.description = this.form.value.description;

    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.place.id, 
        this.form.value.title, 
        this.form.value.description
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
      
    })
    // console.log('onUpdateOffer', this.form);
  }

}
