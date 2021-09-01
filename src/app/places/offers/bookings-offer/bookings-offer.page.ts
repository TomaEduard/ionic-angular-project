import { PlacesService } from './../../places.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings-offer',
  templateUrl: './bookings-offer.page.html',
  styleUrls: ['./bookings-offer.page.scss'],
})
export class BookingsOfferPage implements OnInit, OnDestroy {

  place: Place;
  private placesSub: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (!params.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers')
      }

      this.placesSub = this.placesService.getPlace(params.get('placeId'))
        .subscribe((place: Place) => {
          this.place = place;
        })
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
