import { Capacitor } from '@capacitor/core';
import { PlaceLocation, Coordinates } from './../../../app/places/location.model';
import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from './../../map-modal/map-modal.component';
import { ModalController, ActionSheetController, AlertController, IonButtons } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  onPickLocation() {

    this.actionSheetCtrl.create({
      header: `Please Choose`,
      buttons: [
        {
          text: 'Auto-Locate',
          handler: () => {
            this.locateUser();
          },
        },
        {
          text: 'Pick on Map',
          handler: () => {
            this.openMap();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ]

    }).then(actionSheetEl => {
      actionSheetEl.present();
    })

  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'The device not have acces for geolocation. Please use the map to pick a location!',
      buttons: ['Okay']
    }).then(alert => alert.present());
  }

  private openMap() {
    // response will return lat/lng
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss()
        .then(modalData => {
          if (!modalData.data) {
            return;
          }

          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng
          };

          this.createPlace(coordinates.lat, coordinates.lng);

        })
      modalEl.present();
    })
  }

  private createPlace(lat: number, lng: number) {

    const pickedLocation: PlaceLocation = {
      lat:  lat,
      lng:  lng,
      address: null,
      staticMapImageUrl: null,
    };
    
    this.isLoading = true
    // request to get address from lat/lng
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address: any) => {
          pickedLocation.address = address;
          return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
        })
      ).subscribe(staricMapImageUrl => {
        pickedLocation.staticMapImageUrl = staricMapImageUrl;
        this.selectedLocationImage = staricMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(lat: number, lng: number) {
    const url = `
      https://maps.googleapis.com/maps/api/geocode/json?latlng=
      ${lat},
      ${lng}
      &key=${environment.googleMapAPIKey}
    `

    return this.http.get<any>(url)
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }

          return geoData.results[0].formatted_address;
        })
      );
  }
  
  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&maptype=roadmap&markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapAPIKey}`
  }

}

