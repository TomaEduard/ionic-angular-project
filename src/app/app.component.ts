import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{ 

  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {}


  ngOnInit(): void {
    this.authSub = this.authService.userIsAuthenticated
      .subscribe(isAuth => {
        if (!isAuth && (this.previousAuthState !== isAuth)) {
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    })
  }

  onLogout() {
    this.authService.logout();
  }

}
