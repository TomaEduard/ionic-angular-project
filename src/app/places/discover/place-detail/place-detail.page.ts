import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
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
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/okaces/tabs/discover')
        return;
      }

      this.place = this.placesService.getPlace(params.get('placeId'));
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();

    this.actionSheetCtrl.create({
      header: 'Chose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'desctuctive'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log('mode', mode)

    this.modalCtrl
    .create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place }
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData);
      
      if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      }
    });
  }
}
