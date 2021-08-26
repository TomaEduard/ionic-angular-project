import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];

  constructor(
    private placesService: PlacesService,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    console.log('listedLoadedPlaces', this.listedLoadedPlaces)
  }

  onOpenMenu() {
    this.menuController.toggle('m1')
  }

  onFilterUpdate(event: any) {
    console.log('event.detail', event.detail);
  }

}
