import { PlacesService } from './../../places.service';
import { PlacesRoutingModule } from './../../places-routing.module';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  place: Place;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (!params.has('placeId')) {
        this.navController.navigateBack('/okaces/tabs/offers')
        return;
      }

      this.place = this.placesService.getPlace(params.get('placeId'));
      console.log('this.place', this.place)
    });
  }

}
