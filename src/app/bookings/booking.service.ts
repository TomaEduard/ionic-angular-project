import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { delay, take, tap, switchMap, map } from 'rxjs/operators';

export interface BookingData {
  bookedFrom: string,
  bookedTo: string,
  firstName: string,
  guestNumber: number,
  lastName: string,
  placeId: string,
  placeImage: string;
  placeTitle: string,
  userId: string,
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);

  constructor(
    public authService: AuthService,
    private http: HttpClient
  ) { }


  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string, 
    placeTitle, 
    placeImage: string, 
    firstName: string, 
    lastName: string, 
    guestNumber: number, 
    dateFrom: Date,
    dateTo: Date
  ) {

    let generatedId: string;

    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    )
    
      
    return this.http
      .post<{name: string}>(
        'https://ionic-angular-course-78f48-default-rtdb.europe-west1.firebasedatabase.app/bookings.json',
        {...newBooking, id: null}
      ).pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
    )
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(500),
      tap((bookings: Booking[]) => {
        this._bookings.next(bookings.filter(e => e.id !== bookingId))
      })
    )
  }

  fetchBookings() {
    this.http.get<{[key:string]: BookingData}>(
      `
        https://ionic-angular-course-78f48-default-rtdb.europe-west1.firebasedatabase.app/bookings.json
        ?orderBy="userId"&equalTo="${this.authService.userId}"
      `,
    ).pipe(
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
  
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(new Booking(
              key,
              bookingData[key].placeId,
              bookingData[key].userId,
              bookingData[key].placeTitle,
              bookingData[key].placeImage,
              bookingData[key].firstName,
              bookingData[key].lastName,
              bookingData[key].guestNumber,
              new Date(bookingData[key].bookedFrom),
              new Date(bookingData[key].bookedTo),
            ))
          }
        }
      })
    )
  }

}
