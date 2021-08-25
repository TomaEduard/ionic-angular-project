import { NavController } from '@ionic/angular';
import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offers: Place[];

  constructor(
    private placeService: PlacesService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.offers = this.placeService.places;
  }

}
