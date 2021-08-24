import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingsOfferPage } from './bookings-offer.page';

const routes: Routes = [
  {
    path: '',
    component: BookingsOfferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsOfferPageRoutingModule {}
