import { AuthService } from './../../../auth/auth.service';
import { BookingService } from './../../../bookings/booking.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { PlacesService } from './../../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/bookings/booking.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  isBookable = false;
  isLoading = false;
  private placesSub: Subscription;
  
  constructor(
    private router: Router, 
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private laodingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (!params.has('placeId')) {
        this.navCtrl.navigateBack('/okaces/tabs/discover')
        return;
      }

      this.isLoading = true;
      this.placesSub = this.placesService
        .getPlace(params.get('placeId'))
        .subscribe((place: Place) => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'An error occurred!',
            message: 'Could not load place.',
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/discover']);
              }
            }]
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
      componentProps: { selectedPlace: this.place, selectedMode: mode}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      // console.log(resultData);

      if (resultData.role === 'confirm') {
        this.laodingCtrl
          .create({
            message: 'Booking place...'
          }).then(loadingEl => {
            loadingEl.present();
            const data = resultData.data.bookingData;
    
            // console.log('BOOKED!', resultData);
    
            this.bookingService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              data.firstName,
              data.lastName,
              data.guestNumber,
              data.startDate,
              data.endDate
            ).subscribe((bookings: Booking[]) => {
              loadingEl.dismiss();
            })
            
          })
      }

    });
  }
}
