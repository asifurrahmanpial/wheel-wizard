import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { BookRideComponent } from './pages/book-ride/book-ride.component';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RideSummaryComponent } from './pages/ride-summary/ride-summary.component';
import { RidesComponent } from './pages/rides/rides.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'map',
		component: MapComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{ path: 'registration', component: RegistrationComponent },
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [() => inject(AuthService).shouldLogIn()]
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'ride-history',
		component: RidesComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'book',
		component: BookRideComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	},
	{
		path: 'ride-summary',
		component: RideSummaryComponent,
		canActivate: [() => inject(AuthService).isLoggedIn()]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
