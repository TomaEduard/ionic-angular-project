import { PlacesService } from './../../places.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Place } from '../../place.model';

@Component({
  selector: 'app-bookings-offer',
  templateUrl: './bookings-offer.page.html',
  styleUrls: ['./bookings-offer.page.scss'],
})
export class BookingsOfferPage implements OnInit {

  place: Place;

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

      this.place = this.placesService.getPlace(params.get('placeId'));
    });
  }

}
