import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Place;
  
  constructor(
    private router: Router, 
    private navController: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (!params.has('placeId')) {
        this.navController.navigateBack('/okaces/tabs/discover')
        return;
      }

      this.place = this.placesService.getPlace(params.get('placeId'));
    });
  }

  onBookPlace() {
    this.navController.navigateBack('/places/tabs/discover');
  }
}
