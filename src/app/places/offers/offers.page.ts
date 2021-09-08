import { AuthService } from './../../auth/auth.service';
import { IonItemSliding, NavController } from '@ionic/angular';
import { PlacesService } from './../places.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { Router } from '@angular/router';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy{

  offers: Place[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private placeService: PlacesService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe((places: Place[]) => {
      this.offers = places
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placeService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

}
