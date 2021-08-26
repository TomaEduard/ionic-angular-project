import { IonItemSliding, NavController } from '@ionic/angular';
import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offers: Place[];

  constructor(
    private placeService: PlacesService,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.offers = this.placeService.places;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    // slidingItem.close();
    // this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

}
