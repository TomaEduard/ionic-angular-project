import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingsOfferPageRoutingModule } from './bookings-offer-routing.module';

import { BookingsOfferPage } from './bookings-offer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingsOfferPageRoutingModule
  ],
  declarations: [BookingsOfferPage]
})
export class BookingsOfferPageModule {}
