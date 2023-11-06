import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './pages/camera/camera.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MapComponent } from './pages/map/map.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AuthService } from './services/auth.service';
import { RidesComponent } from './pages/rides/rides.component';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.component';
import { BookRideComponent } from './pages/book-ride/book-ride.component';
import { RideSummaryComponent } from './pages/ride-summary/ride-summary.component';
import { StripeComponent } from './pages/stripe/stripe.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'map',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'camera',
		component: CameraComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'map',
		component: MapComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{ path: 'registration', component: RegistrationComponent },
	{
		path: 'login',
		component: LoginComponent
		// canActivate: [() => inject(AuthService).shouldLogIn()]
	},
	{
		path: 'profile',
		component: ProfileComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'ride-history',
		component: RidesComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'qr',
		component: QrScannerComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'book',
		component: BookRideComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'ride-summary',
		component: RideSummaryComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'stripe',
		component: StripeComponent
		// canActivate: [() => inject(AuthService).isLoggedIn()]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
